(() => {
  console.log("Building `edge-extension-mute-tab-by-default`");

  const path = require("path");
  const fs = require("fs");

  const PROJECT_ROOT_PATH = path.normalize(`${__dirname}/..`);
  const SRC_FOLDER_PATH = path.normalize(`${PROJECT_ROOT_PATH}/src`);
  const SERVICE_WORKER_SCRIPT_FILENAME = `service-worker.js`;
  const SERVICE_WORKER_SCRIPT_PATH = path.normalize(
    `${SRC_FOLDER_PATH}/service-worker/${SERVICE_WORKER_SCRIPT_FILENAME}`,
  );
  const BUILD_FOLDER_PATH = path.normalize(
    `${PROJECT_ROOT_PATH}/BUILD_FOLDER_PATH`,
  );
  const BUILD_SERVICE_WORKER_SCRIPT_PATH = path.normalize(
    `${BUILD_FOLDER_PATH}/${SERVICE_WORKER_SCRIPT_FILENAME}`,
  );

  console.log("Copying service-worker.js");
  fs.copyFile(SERVICE_WORKER_SCRIPT_PATH, BUILD_SERVICE_WORKER_SCRIPT_PATH, (err) => {
    if (err) {
      throw err;
    }
    console.log("Copied service-worker.js");
  });

  console.log("Build complete");
})();
