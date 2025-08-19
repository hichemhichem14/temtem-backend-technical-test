const CodedError = require("../commons/coded-error");
const { ProductModel } = require("../models");
const { deleteFile } = require("../utils/file.helpers");
const { filterUndefined } = require("../utils/mongodb-utils");
const path = require("path");
const fs = require("fs");

/** @class */
class ProductServices {
  /**
   *@param {{name:string; description:string;price:number;category:string;image:string}}
   * @returns {Promise<AppModels.ProductObject>}
   */
  static async addProduct({ name, description, price, category, image }) {
    const existingProduct = await ProductModel.findOne({
      name: name.toLowerCase(),
    });

    if (existingProduct) {
      throw new CodedError(
        "product.name-already-exists",
        "Product name already exist",
        400
      );
    }

    const newProduct = new ProductModel({
      name,
      description,
      price,
      category,
      image,
    });

    if (!newProduct) throw ProductModel.apiErrors.creation_error();

    newProduct.save();

    return newProduct;
  }

  /**
   * @param {AppTypes.ObjectId} productId
   *@param {{description?:string;price?:number;category?:string;image?:string}}
   * @returns {Promise<AppModels.ProductObject>}
   */
  static async updateProduct(
    productId,
    { description, price, category, image }
  ) {
    const product = await ProductModel.findById(productId).orFail(
      ProductModel.apiErrors.not_found()
    );

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        $set: { description, price, category, image },
      },
      { new: true }
    ).orFail(ProductModel.apiErrors.not_found());

    if (product.image !== updatedProduct.image)
      deleteFile(product.image, "storage/product-images");

    return updatedProduct;
  }

  /**
   * @param {AppTypes.ObjectId} productId
   * @returns {Promise<AppModels.ProductObject>}
   */
  static async deleteProduct(productId) {
    const deletedProduct = await ProductModel.findByIdAndDelete(
      productId
    ).orFail(ProductModel.apiErrors.not_found());

    deleteFile(deletedProduct.image, "storage/product-images");

    return deletedProduct;
  }

  /**
   * @param {{
   *     category?    :   string;
   *     sortOptions? : Object;
   * }} params
   * @returns {Promise<(AppModels.ProductObject)[]>}
   */
  static async getProducts({ category, sortOptions }) {
    const queryMatch = {
      $and: filterUndefined([category ? { category: category } : undefined]),
    };
    const products = await ProductModel.find(queryMatch).sort(sortOptions);

    return products;
  }

  /**
   * @param {sting} fileName
   * @returns {string}
   */
  static getProductFileImagePath(fileName) {
    const filePath = path.join(
      __dirname,
      "..",
      "storage",
      "product-images",
      fileName
    );

    if (!fs.existsSync(filePath)) {
      return new CodedError(
        "product.image-file-not-found",
        "Product's image file not found",
        404
      );
    }

    return filePath;
  }
}

module.exports = ProductServices;
