/**
 *
 * @param path {string}
 * @returns {Promise<boolean>}
 */
const isFileExist = (path) => {
  const fs = require("node:fs");

  return new Promise((resolve) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
};

/**
 *
 * @param src {string}
 * @param dest {string}
 * @param filenameForLogging {string | undefined}
 * @returns {Promise<void>}
 */
const cpWithLogging = async (src, dest, filenameForLogging = undefined) => {
  const fs = require("node:fs/promises");

  filenameForLogging = filenameForLogging ?? src;

  console.log(`Copying ${filenameForLogging}`);
  await fs.cp(src, dest, { recursive: true });
  console.log(`Copied ${filenameForLogging}`);
};

(async () => {
  console.log("Building `edge-extension-mute-tab-by-default`");

  const path = require("path");
  const fs = require("node:fs/promises");

  const PROJECT_ROOT_PATH = path.normalize(`${__dirname}/..`);
  const SRC_FOLDER_PATH = path.normalize(`${PROJECT_ROOT_PATH}/src`);
  const BUILD_FOLDER_PATH = path.normalize(`${PROJECT_ROOT_PATH}/build`);

  if (await isFileExist(BUILD_FOLDER_PATH)) {
    console.log("Deleting build/ folder");
    await fs.rmdir(BUILD_FOLDER_PATH, { recursive: true });
    console.log("Deleted build/ folder");
  }

  console.log("Creating build/ folder");
  await fs.mkdir(BUILD_FOLDER_PATH);
  console.log("Created build/ folder");

  const SERVICE_WORKER_SCRIPT_FILENAME = `service-worker.js`;
  const SERVICE_WORKER_SCRIPT_PATH = path.normalize(
    `${SRC_FOLDER_PATH}/service-worker/${SERVICE_WORKER_SCRIPT_FILENAME}`,
  );
  const BUILD_SERVICE_WORKER_SCRIPT_PATH = path.normalize(
    `${BUILD_FOLDER_PATH}/${SERVICE_WORKER_SCRIPT_FILENAME}`,
  );
  await cpWithLogging(
    SERVICE_WORKER_SCRIPT_PATH,
    BUILD_SERVICE_WORKER_SCRIPT_PATH,
  );

  const MANIFEST_FILENAME = `manifest.json`;
  const MANIFEST_PATH = path.normalize(
    `${PROJECT_ROOT_PATH}/${MANIFEST_FILENAME}`,
  );
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
