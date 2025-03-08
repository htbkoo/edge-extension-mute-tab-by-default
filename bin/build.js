const buildOptionsPage = async () => {
  const { BUILD_FOLDER_PATH, SRC_FOLDER_PATH } = require("./constants");
  const { cpWithLogging } = require("./utils");

  await cpWithLogging(
    `${SRC_FOLDER_PATH}/options/index.html`,
    `${BUILD_FOLDER_PATH}/options.html`,
  );
};

(async () => {
  console.log("Building `edge-extension-mute-tab-by-default`");

  const path = require("path");
  const fs = require("node:fs/promises");
  const esbuild = require("esbuild");

  const { cpWithLogging, isFileExist } = require("./utils");
  const {
    BUILD_FOLDER_PATH,
    PROJECT_ROOT_PATH,
    SRC_FOLDER_PATH,
    MANIFEST_FILENAME,
    MANIFEST_PATH,
  } = require("./constants");

  if (await isFileExist(BUILD_FOLDER_PATH)) {
    console.log("Deleting build/ folder");
    await fs.rm(BUILD_FOLDER_PATH, { recursive: true });
    console.log("Deleted build/ folder");
  }

  console.log("Creating build/ folder");
  await fs.mkdir(BUILD_FOLDER_PATH);
  console.log("Created build/ folder");

  const SERVICE_WORKER_SCRIPT_PATH = path.normalize(
    `${SRC_FOLDER_PATH}/service-worker/service-worker.ts`,
  );
  const BUILD_SERVICE_WORKER_SCRIPT_PATH = path.normalize(
    `${BUILD_FOLDER_PATH}/service-worker.js`,
  );

  console.log("Building service-worker script");
  await esbuild.build({
    entryPoints: [SERVICE_WORKER_SCRIPT_PATH],
    outfile: BUILD_SERVICE_WORKER_SCRIPT_PATH,
    // reference: https://esbuild.github.io/getting-started/#bundling-for-the-browser
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ["chrome58", "firefox57", "safari11", "edge16"],
  });
  console.log("Built service-worker script");

  console.log("Building options page");
  await buildOptionsPage();
  console.log("Built options page");

  const BUILD_MANIFEST_PATH = path.normalize(
    `${BUILD_FOLDER_PATH}/${MANIFEST_FILENAME}`,
  );
  await cpWithLogging(MANIFEST_PATH, BUILD_MANIFEST_PATH);

  const ICONS_FOLDER_NAME = `icons`;
  const ICONS_PATH = path.normalize(
    `${PROJECT_ROOT_PATH}/${ICONS_FOLDER_NAME}`,
  );
  const BUILD_ICONS_PATH = path.normalize(
    `${BUILD_FOLDER_PATH}/${ICONS_FOLDER_NAME}`,
  );
  await cpWithLogging(ICONS_PATH, BUILD_ICONS_PATH);

  console.log("Build complete");
})();
