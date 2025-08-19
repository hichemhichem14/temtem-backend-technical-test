const config = require("../config");
const AuthServices = require("../services/auth.services");

const CodedError = require("../commons/coded-error");
const { asyncErrorWrapper } = require("../routes/helpers");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns
 */
const authenticatedMiddleware = asyncErrorWrapper(async (req, res, next) => {
  const [_, token] =
    req.headers && req.headers[config.security.authHeader]
      ? req.headers[config.security.authHeader]
          ?.toString()
          .split("Bearer ") ?? [null, null]
      : [null, null];

  // throw error message if token does not exist
  if (!token) {
    throw new CodedError("auth.missing-token", "Missing user token", 400);
  }

  // getting the user from the token
  const { user } = await AuthServices.getByToken(token);

  // throw error message if user dose not exist
  if (!user) {
    throw new CodedError("auth.erroneous-token", "Invalid user token", 400);
  }

  if (!user.is_email_validated) {
    throw new CodedError(
      "auth.erroneous-token",
      "User require email validation",
      400
    );
  }

  res.locals.user = user;

  return next();
});

module.exports = authenticatedMiddleware;
