import { fileURLToPath } from "url";
import path, { dirname } from "path";

/**
 * Shim for {@link __dirname} for ESM
 * @see {@link https://nodejs.org/api/esm.html#esm_no_require_exports_module_exports_filename_dirname}
 * @see {@link https://stackoverflow.com/a/64383997}
 * @returns {string}
 */
const shimDirName = () => {
  const filename = fileURLToPath(import.meta.url);
  return dirname(filename);
};

export const PROJECT_ROOT_PATH = path.normalize(`${shimDirName()}/..`);
export const SRC_FOLDER_PATH = path.normalize(`${PROJECT_ROOT_PATH}/src`);
export const BUILD_FOLDER_PATH = path.normalize(`${PROJECT_ROOT_PATH}/build`);
export const MANIFEST_FILENAME = `manifest.json`;
export const MANIFEST_PATH = path.normalize(
  `${PROJECT_ROOT_PATH}/${MANIFEST_FILENAME}`,
);
export const PACKAGE_JSON_FILENAME = `package.json`;
export const PACKAGE_JSON_PATH = path.normalize(
  `${PROJECT_ROOT_PATH}/${PACKAGE_JSON_FILENAME}`,
);
