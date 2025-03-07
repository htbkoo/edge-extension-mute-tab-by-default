/**
 * Check if file exists, using {@link fs.access}
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
 * Copy files / directories with logging, using {@link fs.cp}
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

module.exports = {
  isFileExist,
  cpWithLogging,
};
