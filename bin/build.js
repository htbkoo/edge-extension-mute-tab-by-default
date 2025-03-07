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

(async () => {
  console.log("Building `edge-extension-mute-tab-by-default`");

  const path = require("path");
  const fs = require("node:fs/promises");

  const PROJECT_ROOT_PATH = path.normalize(`${__dirname}/..`);
  const SRC_FOLDER_PATH = path.normalize(`${PROJECT_ROOT_PATH}/src`);
  const SERVICE_WORKER_SCRIPT_FILENAME = `service-worker.js`;
  const SERVICE_WORKER_SCRIPT_PATH = path.normalize(
    `${SRC_FOLDER_PATH}/service-worker/${SERVICE_WORKER_SCRIPT_FILENAME}`,
  );
  const BUILD_FOLDER_PATH = path.normalize(
    `${PROJECT_ROOT_PATH}/build`,
  );
  const BUILD_SERVICE_WORKER_SCRIPT_PATH = path.normalize(
    `${BUILD_FOLDER_PATH}/${SERVICE_WORKER_SCRIPT_FILENAME}`,
  );

  if (await isFileExist(BUILD_FOLDER_PATH)) {
    console.log("Deleting build/ folder");
    await fs.rmdir(BUILD_FOLDER_PATH, { recursive: true });
    console.log("Deleted build/ folder");
  }

  console.log("Creating build/ folder");
  await fs.mkdir(BUILD_FOLDER_PATH);
  console.log("Created build/ folder");

  console.log("Copying service-worker.js");
  await fs.copyFile(
    SERVICE_WORKER_SCRIPT_PATH,
    BUILD_SERVICE_WORKER_SCRIPT_PATH,
  );
  console.log("Copied service-worker.js");

  console.log("Build complete");
})();
