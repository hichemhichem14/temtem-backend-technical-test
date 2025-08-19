const UserModel = require("./user.model");
const EmailValidationTokenModel = require("./email-validation-token.model");
const ProductModel = require("./product.model");

const appModels = {
  UserModel,
  EmailValidationTokenModel,
  ProductModel,
};

/** @typedef {(typeof appModels)[keyof typeof appModels]} TAppModel */

module.exports = appModels;
