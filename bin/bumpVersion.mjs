import fs from "node:fs/promises";
import * as childProcess from "child_process";

import { MANIFEST_PATH, PACKAGE_JSON_PATH } from "./constants.mjs";
import * as util from "node:util";

const exec = util.promisify(childProcess.exec);

/**
 * Get new version string based on the current version
 * @param version {string}
 * @returns {string}
 */
const getNewVersion = (version) => {
  const versionParts = version.split(".");
  if (versionParts.length !== 3) {
    throw new Error(`Version ${version} is not in the format of x.y.z`);
  }

  const [major, minor, _] = versionParts;

  const minorVersion = parseInt(minor);
  if (!Number.isInteger(minorVersion)) {
    throw new Error(
      `Minor version ${minor} of version ${version} is not an integer`,
    );
  }
  return `${major}.${minorVersion + 1}.0`;

  /*
  // TODO: accept a parameter to specify which part of the version to bump, or an exact version to bump to
    if (versionParts[0] === "0") {
      const minorVersion = parseInt(minor);
      if (!Number.isInteger(minorVersion)) {
        throw new Error(
          `Minor version ${minor} of version ${version} is not an integer`,
        );
      }
      return `${major}.${minorVersion + 1}.0`;
    }

    const majorVersion = parseInt(major);
    if (!Number.isInteger(majorVersion)) {
      throw new Error(
        `Minor version ${majoror} of version ${version} is not an integer`,
      );
    }
    return `${major}.0.0`;
    */
};

/**
 * Add changes to git
 * @returns {Promise<void>}
 */
const gitAdd = async (path) =>
  new Promise((resolve, reject) => {
    exec(`git add "${path}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
      } else if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(stderr);
      } else {
        console.log(`${stdout}`);
        resolve();
      }
    });
  });

/**
 * Create a git commit
 * @param message {string}
 * @returns {Promise<void>}
 */
const gitCommitVersionBump = async (message) =>
  new Promise((resolve, reject) => {
    exec(`git commit "${message}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
      } else if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(stderr);
      } else {
        console.log(`${stdout}`);
        resolve();
      }
    });
  });

/**
 * Create a git tag
 * @param version {string}
 * @returns {Promise<void>}
 */
const createGitTag = async (version) => {
  const commitMessage = `chore(Version): Bump version to v${version}`;

  await gitCommitVersionBump(commitMessage);

  try {
    const { stdout, stderr } = await exec(
      `git tag -a v0.9.0 -m "chore(Version): Bump version to v0.9.0`,
    );
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    } else {
      console.log(`${stdout}`);
    }
  } catch (error) {
    console.error(`exec error: ${error}`);
    return;
  }
};

(async () => {
  console.log("Bumping version of `edge-extension-mute-tab-by-default`");

  const manifestString = await fs.readFile(MANIFEST_PATH, { encoding: "utf8" });
  const manifestJson = JSON.parse(manifestString);
  const packageString = await fs.readFile(PACKAGE_JSON_PATH, {
    encoding: "utf8",
  });
  const packageJson = JSON.parse(packageString);

  if (!("version" in manifestJson)) {
    throw new Error("manifest.json does not have version field");
  }
  if (!("version" in packageJson)) {
    throw new Error("package.json does not have a version field");
  }
  if (manifestJson.version !== packageJson.version) {
    throw new Error(
      `Version in manifest.json (${manifestJson.version}) is different from version in package.json (${packageJson.version})`,
    );
  }

  const version = manifestJson.version;
  const newVersion = getNewVersion(version);

  await fs.writeFile(
    MANIFEST_PATH,
    JSON.stringify({ ...manifestJson, version: newVersion }, null, 2) + "\n",
  );
  await fs.writeFile(
    PACKAGE_JSON_PATH,
    JSON.stringify({ ...packageJson, version: newVersion }, null, 2) + "\n",
  );

  console.log("Bum version complete");
})();
