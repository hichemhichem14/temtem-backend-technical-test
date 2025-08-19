const mongoose = require("mongoose");
const {
  documentToObject,
  getSchemaStaticsAndMethods,
  encodeSingleId,
} = require("./helpers.js");

/**
 * @typedef {typeof ProductSchema} TProductSchema
 *
 *   We use this to define a temporary document for `this{}` definitions
 *
 * @typedef {import("./helpers").HydratedDocumentFromDefinition<typeof ProductSchemaDefinition>} ProductHydratedDocument
 */

const ProductSchemaDefinition = /** @type {const} */ ({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: false,
  },
  image: {
    type: String,
    required: true,
  },
});

const ProductSchema = new mongoose.Schema(ProductSchemaDefinition, {
  ...getSchemaStaticsAndMethods(
    "Product",
    {
      encodeDocument: encode,
    },
    {
      customMethods: {},
      customStatics: {},
    }
  ),
});

/**
 * @param {any} product
 * @returns {any}
 */
function encode(product) {
  const productObj = documentToObject(product, ProductSchema);

  delete productObj.id;

  return {
    ...productObj,
    _id: encodeSingleId(productObj._id),
  };
}

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
