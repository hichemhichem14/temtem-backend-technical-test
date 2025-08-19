const multer = require("multer");
const path = require("path");
const fs = require("fs");
const CodedError = require("../commons/coded-error");
const { asyncErrorWrapper } = require("../routes/helpers");

const uploadFileMiddleware = (fieldName, folder) => {
  // 1. Validate fieldName param when creating middleware
  if (!fieldName || typeof fieldName !== "string") {
    throw new CodedError("bad-request.invalid-param", "", 404);
  }

  const uploadPath = path.join(__dirname, "..", folder);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname || "");
      const safeFieldName = fieldName.replace(/[^a-z0-9]/gi, "_");
      const name = `${safeFieldName}-${Date.now()}${ext}`;
      cb(null, name);
    },
  });

  const uploadFile = multer({ storage });

  return asyncErrorWrapper(async (req, res, next) => {
    uploadFile.single(fieldName)(req, res, (err) => {
      if (err) {
        throw new CodedError("bad-request.invalid-file", "Invalid file", 400);
      }

      return next();
    });
  });
};

module.exports = uploadFileMiddleware;
