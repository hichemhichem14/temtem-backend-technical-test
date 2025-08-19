const CodedError = require("../commons/coded-error");
const { UserModel } = require("../models");
const { asyncErrorWrapper, successResponse } = require("../routes/helpers");

const {
  signUpDataValidator,
  signUpPasswordValidator,
  loginValidator,
  emailValidationTokenValidator,
} = require("../validators/auth.validator");
const AuthServices = require("../services/auth.services");

// User Sign-up
module.exports.signUp = asyncErrorWrapper(async (req, res, _next) => {
  const { email } = signUpDataValidator(req.body);
  await AuthServices.validateSignUp({
    email,
  });

  const { password } = signUpPasswordValidator(req.body);

  const newUser = await AuthServices.signUp({
    email,
    role: "guest",
    password,
  });

  // Create a new validation email token
  const emailValidationToken = await AuthServices.createEmailValidationToken(
    newUser
  );

  // Send the validation email token
  await AuthServices.sendEmailValidationEmail(
    newUser,
    emailValidationToken.token
  );

  return successResponse(res, {
    message: "User signed up successfully but need email confirmation",
    data: {
      user: newUser.toEncoded(),
    },
  });
});

exports.webLogin = asyncErrorWrapper(async (req, res, _next) => {
  const { email, password } = loginValidator(req.body);

  const user = await AuthServices.webLogin({ email, password });

  if (!user) {
    throw new CodedError(
      "auth.invalid-credentials",
      "Invalid user credentials"
    );
  }

  return successResponse(res, {
    message: "Login successful",
    data: {
      user: user,
    },
  });
});

// Confirm Email Validation
module.exports.confirmEmailValidation = asyncErrorWrapper(
  async (req, res, _next) => {
    // Validate input
    const { token } = emailValidationTokenValidator(req.body);

    // Validate email token
    const emailValidationToken =
      await AuthServices.validateEmailValidationToken(token);

    // Mark email as confirmed
    const user = await AuthServices.confirmUserEmail(emailValidationToken);

    const userToken = AuthServices.generateJWT(user);
    return successResponse(res, {
      message: "Email confirmed successfully",
      data: {
        valid: true,
        user: user.toEncoded(),
        token: userToken,
      },
    });
  }
);

module.exports.logout = asyncErrorWrapper(async (req, res, _next) => {
  const user = await res.locals.user;

  user.last_logout_time = new Date();

  await user.save();

  return res.json({ success: true });
});
