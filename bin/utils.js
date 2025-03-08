import fsCallback from "node:fs";
import fs from "node:fs/promises";

/**
 * Check if file exists, using {@link fs.access}
 * @param path {string}
 * @returns {Promise<boolean>}
 */
export const isFileExist = (path) => {
  return new Promise((resolve) => {
    fsCallback.access(path, fsCallback.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
};

/**
 * Copy files / directories with logging, using {@link fs.cp}
 *
 * @param src {string}
 * @param dest {string}
 * @param filenameForLogging {string | undefined}
 * @returns {Promise<void>}
 */
export const cpWithLogging = async (src, dest, filenameForLogging = undefined) => {
  filenameForLogging = filenameForLogging ?? src;

  console.log(`Copying ${filenameForLogging}`);
  await fs.cp(src, dest, { recursive: true });
  console.log(`Copied ${filenameForLogging}`);
};
