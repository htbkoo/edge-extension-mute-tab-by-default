import path from "path";
import fs from "node:fs/promises";
import esbuild from "esbuild";

import {
  BUILD_FOLDER_PATH,
  SRC_FOLDER_PATH,
  PROJECT_ROOT_PATH,
  MANIFEST_FILENAME,
  MANIFEST_PATH,
} from "./constants.mjs";
import { cpWithLogging, isFileExist } from "./utils.mjs";

const buildOptionsPage = async () => {
  const OPTIONS_PAGE_FOLDER_PATH = path.normalize(`${SRC_FOLDER_PATH}/options`);

  console.log("Building options page script");
  await esbuild.build({
    entryPoints: [`${OPTIONS_PAGE_FOLDER_PATH}/src/main.jsx`],
    outfile: `${BUILD_FOLDER_PATH}/options.js`,
    // reference: https://stackoverflow.com/a/77116077
    loader: {
      ".png": "dataurl",
      ".svg": "dataurl",
      ".js": "jsx",
      ".jsx": "jsx",
      ".ts": "tsx",
      ".tsx": "tsx",
    },
    // reference: https://esbuild.github.io/getting-started/#bundling-for-the-browser
    bundle: true,
    minify: true,
    sourcemap: true,
    target: [
      // reference: https://github.com/nuxt/vite/issues/110#issuecomment-850400562
      "chrome60",
      "edge18",
      "firefox60",
      "safari11",
    ],
  });
  console.log("Built options page script");

  await cpWithLogging(
    `${OPTIONS_PAGE_FOLDER_PATH}/index.html`,
    `${BUILD_FOLDER_PATH}/options.html`,
  );
};

(async () => {
  console.log("Building `edge-extension-mute-tab-by-default`");

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
