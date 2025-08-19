const Joi = require("joi");
const { makeValidator } = require("./validation-helpers");

/**
 * ##############################################################\
 * ############## Add Product Schemas #############\
 * ##############################################################\
 */
const addProductValidationSchema = /**
 * @type {typeof Joi.object<
 *     {
 *       name:string;
 *       description:string;
 *       price:number;
 *       category:string;
 *     },
 *     true
 * >}
 */ (Joi.object)({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
});

/**
 * ##############################################################\
 * ############## Update Product Schemas #############\
 * ##############################################################\
 */
const updateProductValidationSchema = /**
 * @type {typeof Joi.object<
 *     {
 *       name?:string;
 *       description?:string;
 *       price?:number;
 *       category?:string;
 *       image?:string;
 *     },
 *     true
 * >}
 */ (Joi.object)({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().optional(),
  category: Joi.string().optional(),
});

module.exports.addProductValidator = makeValidator(
  (_) => addProductValidationSchema
);
module.exports.updateProductValidator = makeValidator(
  (_ctx) => updateProductValidationSchema
);
