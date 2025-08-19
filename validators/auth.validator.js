const Joi = require("joi");
const { makeValidator } = require("./validation-helpers");
const {
  emailJoiRule,
  passwordJoiRule,
  passwordConfirmationJoiRule,
} = require("./common-rules.validator");

/**
 * ##############################################################\
 * ############## Signup & Login Validation Schemas #############\
 * ##############################################################\
 */

const signUpDataValidationSchema = /**
 * @type {typeof Joi.object<
 *     {
 *         email: string;
 *     },
 *     true
 * >}
 */ (Joi.object)({
  email: emailJoiRule.required(),
});

const signUpPasswordValidationSchema = /**
 * @type {typeof Joi.object<
 *     {
 *         password: string;
 *         password_confirmation: string;
 *     },
 *     true
 * >}
 */ (Joi.object)({
  password: passwordJoiRule.required(),
});

const loginValidationSchema =
  /** @type {typeof Joi.object<{ email: string; password: string }>} */ (
    Joi.object
  )({
    email: emailJoiRule.required(),
    password: passwordJoiRule.required(),
  });

module.exports.loginValidator = makeValidator((_) => loginValidationSchema);
module.exports.signUpDataValidator = makeValidator(
  (_ctx) => signUpDataValidationSchema
);
module.exports.signUpPasswordValidator = makeValidator(
  (_ctx) => signUpPasswordValidationSchema
);

const emailValidationSchema =
  /** @type {typeof Joi.object<{ token: string }>} */ (Joi.object)({
    token: Joi.string().required().messages({
      "string.base": "Token should be a string",
      "string.empty": "Token cannot be empty",
      "any.required": "Token is a required field",
    }),
  });

module.exports.emailValidationTokenValidator = makeValidator(
  (_) => emailValidationSchema
);
