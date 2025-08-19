const path = require("path");
const fs = require("fs");

/**
 * @param {string} filename
 * @param {string} folder
 * @returns {void}
 */
const deleteFile = (filename, folder) => {
  const fullPath = path.join(__dirname, "..", folder, filename);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

module.exports = { deleteFile };
