const mainRouter = require("express").Router();

const AuthRouter = require("./auth.routes");
const ProductRouter = require("./product.routes");

mainRouter.use("/auth", AuthRouter);
mainRouter.use("/products", ProductRouter);

mainRouter.get("/", (req, res) => {
  return res.json({ message: "Welcome to  API" });
});

module.exports = mainRouter;
