const Joi = require("joi");
const CodedError = require("../commons/coded-error");

module.exports.ValidObjectId = () =>
  Joi.string().length(24).messages({
    "string.base": "{#label} should be a type of string",
    "string.empty": "{#label} cannot be empty",
    "string.hex": "{#label} must be a valid hexadecimal string",
    "string.length": "{#label} should be exactly {#limit} characters long",
    "any.required": "{#label} is a required field",
  });

/**
 * @param {(context?: TContext) => Joi.Schema<TSchema>} schemaFactory
 * @param {{ allowUnknown?: boolean }} [validationOptions]
 * @returns {(data: any, context?: TContext) => TSchema}
 */
module.exports.makeValidator = (
  schemaFactory,
  { allowUnknown = true } = {}
) => {
  return (data, context) => {
    try {
      const value = Joi.attempt(data, schemaFactory(context), {
        allowUnknown: true,
        stripUnknown: !allowUnknown,
      });

      return value;
    } catch (error) {
      if (error instanceof CodedError) {
        throw error;
      }
      const errorMessage = error.details[0]?.message
        ?.replace(/['"]/g, "")
        ?.replace(/_/g, " ");

      throw new CodedError("validation-error", errorMessage, 400);
    }
  };
};
