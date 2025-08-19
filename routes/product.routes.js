const ProductRouter = require("express").Router();

const ProductController = require("../controllers/product.controller.js");

const {
  authenticatedMiddleware,
  authorizedMiddleware,
  uploadFileMiddleware,
  decodeIdsMiddleware,
} = require("../middlewares");

ProductRouter.post(
  "/",
  authenticatedMiddleware,
  authorizedMiddleware("owner"),
  uploadFileMiddleware("product_image", "storage/product-images"),
  ProductController.addProduct
);

ProductRouter.put(
  "/:productId",
  authenticatedMiddleware,
  authorizedMiddleware("owner"),
  decodeIdsMiddleware,
  uploadFileMiddleware("product_image", "storage/product-images"),
  ProductController.updateProduct
);

ProductRouter.delete(
  "/:productId",
  authenticatedMiddleware,
  decodeIdsMiddleware,
  authorizedMiddleware("owner"),
  ProductController.deleteProduct
);

ProductRouter.get(
  "/",
  authenticatedMiddleware,
  authorizedMiddleware("owner", "guest"),
  ProductController.getProducts
);

ProductRouter.get(
  "/images/:fileName",
  authenticatedMiddleware,
  authorizedMiddleware("owner", "guest"),
  ProductController.getProductImage
);

module.exports = ProductRouter;
