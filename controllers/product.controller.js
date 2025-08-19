const CodedError = require("../commons/coded-error");
const { ProductModel } = require("../models");
const {
  asyncErrorWrapper,
  successResponse,
  parsePaginationQueryParams,
  parseQueryParams,
  parsePathParamObjectId,
} = require("../routes/helpers");

const {
  addProductValidator,
  updateProductValidator,
} = require("../validators/product.validator");

const ProductServices = require("../services/product.services");

module.exports.getProducts = asyncErrorWrapper(async (req, res, _next) => {
  const { sortOptions } = await parsePaginationQueryParams(req);
  const { category } = parseQueryParams(req, ["category"]);

  const products = await ProductServices.getProducts({ category, sortOptions });

  return successResponse(res, {
    message: "fetch products",
    data: {
      products: products.map((product) => ProductModel.encode(product)),
    },
  });
});

module.exports.getProductImage = asyncErrorWrapper(async (req, res, _next) => {
  const fileName = req.params.fileName;

  const filePath = ProductServices.getProductFileImagePath(fileName);

  return res.sendFile(filePath);
});

exports.addProduct = asyncErrorWrapper(async (req, res, _next) => {
  const { name, description, price, category } = addProductValidator(req.body);

  const imageFile = req.file;

  if (!imageFile)
    throw new CodedError(
      "bad-request.missing-param",
      "Missing product's image",
      400
    );

  const newProduct = await ProductServices.addProduct({
    name,
    description,
    price,
    category,
    image: imageFile.filename,
  });

  return successResponse(res, {
    message: "product added successfully",
    data: {
      product: ProductModel.encode(newProduct),
    },
  });
});

exports.updateProduct = asyncErrorWrapper(async (req, res, _next) => {
  const productId = parsePathParamObjectId(req, "productId");

  const { name, description, price, category } = updateProductValidator(
    req.body
  );

  const imageFile = req.file;

  const updatedProduct = await ProductServices.updateProduct(productId, {
    name,
    description,
    price,
    category,
    image: imageFile?.filename,
  });

  return successResponse(res, {
    message: "product updated successfully",
    data: {
      product: ProductModel.encode(updatedProduct),
    },
  });
});

exports.deleteProduct = asyncErrorWrapper(async (req, res, _next) => {
  const productId = parsePathParamObjectId(req, "productId");

  const deletedProduct = await ProductServices.deleteProduct(productId);

  return successResponse(res, {
    message: "product deleted successfully",
    data: {
      product: ProductModel.encode(deletedProduct),
    },
  });
});
