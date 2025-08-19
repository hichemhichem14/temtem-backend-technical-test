const Joi = require("joi");
const CodedError = require("../commons/coded-error");

const emailJoiRule = Joi.string().email().messages({
  "string.base": "Email should be a type of string",
  "string.empty": "Email cannot be empty",
  "string.email": "Email must be a valid email address",
  "any.required": "Email is a required field",
});

const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,30}$/;

const passwordJoiRule = Joi.string()
  .min(8)
  .max(30)
  .pattern(passwordRegex)
  .messages({
    "string.base": "Password should be a type of string",
    "string.empty": "Password cannot be empty",
    "string.min": "Your password must be at least 8 characters long.",
    "string.max": "Your password must be no more than 30 characters long.",
    "string.pattern.base": `Your password must consist of:
    - A minimum of 8 characters,
    - At least one number (0-9),
    - At least one lowercase letter (a-z),
    - At least one uppercase letter (A-Z),
    - At least one special character (!@#$%^&*()_+-=[]}{;':"|,.<>/?).`,
    "any.required": "Password is a required field",
  });

const passwordConfirmationJoiRule = Joi.string()
  .valid(Joi.ref("password"))
  .messages({
    "string.base": "Password confirmation should be a type of string",
    "string.empty": "Password confirmation cannot be empty",
    "any.only": "Password confirmation does not match password",
    "any.required": "Password confirmation is a required field",
  });

module.exports = {
  emailJoiRule,
  passwordJoiRule,
  passwordConfirmationJoiRule,
};
