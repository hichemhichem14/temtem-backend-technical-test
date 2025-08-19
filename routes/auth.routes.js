const AuthRouter = require("express").Router();

const AuthController = require("../controllers/auth.controller.js");
const {
  makeRateLimiter,
} = require("../middlewares/rate-limiter.middleware.js");

const { authenticatedMiddleware } = require("../middlewares");

// Setup rater Limit
const RATE_LIMIT_TIME_WINDOW = 1;
const MAX_TENTATIVES_IN_TIME_WINDOW = 50;

const authRateLimiter = makeRateLimiter(
  RATE_LIMIT_TIME_WINDOW,
  MAX_TENTATIVES_IN_TIME_WINDOW
);

// Login
AuthRouter.post("/login", authRateLimiter, AuthController.webLogin);

// Sign-up
AuthRouter.post("/sign-up", AuthController.signUp);

// Confirm Email Validation
AuthRouter.post(
  "/email-validation/confirm",
  AuthController.confirmEmailValidation
);

// Logout
AuthRouter.post("/logout", authenticatedMiddleware, AuthController.logout);

module.exports = AuthRouter;
