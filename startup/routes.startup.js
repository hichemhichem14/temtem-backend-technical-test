const express = require("express");
const cors = require("cors");
const { errorMiddleware } = require("../middlewares");
const mainRouter = require("../routes");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  app.use("/api", mainRouter);
  app.use(errorMiddleware);
};
