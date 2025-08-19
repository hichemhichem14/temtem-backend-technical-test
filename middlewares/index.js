const authenticatedMiddleware = require("./authenticated.middleware");
const authorizedMiddleware = require("./authorized.middleware");
const errorMiddleware = require("./error.middleware");
const uploadFileMiddleware = require("./upload-files.middleware");
const decodeIdsMiddleware = require("./decode-ids.middleware");

module.exports = {
  authenticatedMiddleware,
  errorMiddleware,
  authorizedMiddleware,
  uploadFileMiddleware,
  decodeIdsMiddleware,
};
