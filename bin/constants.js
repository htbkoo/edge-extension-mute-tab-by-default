const path = require("path");

const PROJECT_ROOT_PATH = path.normalize(`${__dirname}/..`);
const SRC_FOLDER_PATH = path.normalize(`${PROJECT_ROOT_PATH}/src`);
const BUILD_FOLDER_PATH = path.normalize(`${PROJECT_ROOT_PATH}/build`);

module.exports = {
  PROJECT_ROOT_PATH,
  SRC_FOLDER_PATH,
  BUILD_FOLDER_PATH,
};
