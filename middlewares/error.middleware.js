const CodedError = require("../commons/coded-error");
const winston = require("winston");

const errorMiddleware = (err, _req, res, next) => {
  if (err) {
    if (err instanceof CodedError) {
      winston.error(err.toString());
      winston.error(err.stack);
      return res
        .status(err.status)
        .json({ message: err.message, code: err.code });
    }
  }
  return next();
};

module.exports = errorMiddleware;
