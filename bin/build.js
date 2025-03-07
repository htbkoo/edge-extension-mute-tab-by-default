(async () => {
  console.log("Building `edge-extension-mute-tab-by-default`");

  const path = require("path");
  const fs = require("node:fs/promises");

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
