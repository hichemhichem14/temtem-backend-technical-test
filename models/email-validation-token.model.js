const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { getSchemaStaticsAndMethods } = require("./helpers");
const { documentToObject } = require("./helpers");

const EmailValidationTokenSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expires_at: {
      type: Date,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    is_used: {
      type: Boolean,
      default: false,
    },
  },
  {
    ...getSchemaStaticsAndMethods(
      "EmailValidationToken",
      {
        encodeDocument: encode,
      },
      {
        customStatics: {},
        customMethods: {},
      }
    ),
  }
);

/**
 * @param {any} emailToken
 * @returns {any}
 */
function encode(emailToken) {
  const emailValidationTokenObj = documentToObject(
    emailToken,
    EmailValidationTokenSchema
  );
  return {
    ...emailValidationTokenObj,
    _id: encodeSingleId(emailValidationTokenObj._id),
    user_id: encodeSingleId(emailValidationTokenObj.user_id),
  };
}

const EmailValidationTokenModel = mongoose.model(
  "EmailValidationToken",
  EmailValidationTokenSchema
);

module.exports = EmailValidationTokenModel;
