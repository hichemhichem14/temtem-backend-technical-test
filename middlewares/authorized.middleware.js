const CodedError = require("../commons/coded-error");
const { asyncErrorWrapper } = require("../routes/helpers");

/**
 * Used to check allowed user roles
 * @param {import("../config").roles[]} roles
 * @returns {(req: Request, res: Response, next: NextFunction) => Promise<T | void>}
 */
function authorizeMiddleware(...roles) {
  return asyncErrorWrapper((req, res, next) => {
    const user = res.locals.user;
    if (roles.includes(user.role.toString())) {
      return next();
    }
    throw new CodedError(
      "auth.not-allowed",
      "User is not allowed to do this action",
      401
    );
  });
}

module.exports = authorizeMiddleware;
