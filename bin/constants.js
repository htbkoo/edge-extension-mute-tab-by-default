const path = require("path");

const PROJECT_ROOT_PATH = path.normalize(`${__dirname}/..`);
const SRC_FOLDER_PATH = path.normalize(`${PROJECT_ROOT_PATH}/src`);
const BUILD_FOLDER_PATH = path.normalize(`${PROJECT_ROOT_PATH}/build`);
const MANIFEST_FILENAME = `manifest.json`;
const MANIFEST_PATH = path.normalize(
  `${PROJECT_ROOT_PATH}/${MANIFEST_FILENAME}`,
);
const PACKAGE_JSON_FILENAME = `package.json`;
const PACKAGE_JSON_PATH = path.normalize(
  `${PROJECT_ROOT_PATH}/${PACKAGE_JSON_FILENAME}`,
);

module.exports = {
  PROJECT_ROOT_PATH,
  SRC_FOLDER_PATH,
  BUILD_FOLDER_PATH,
  MANIFEST_FILENAME,
  MANIFEST_PATH,
  PACKAGE_JSON_FILENAME,
  PACKAGE_JSON_PATH,
};
