/* eslint-disable no-undef */
const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  try {
    const dbUrl = config.get("db.url");
    mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.Promise = global.Promise;

    mongoose.connection.on("connected", () => {
      winston.info(`Connected to ${mongoose.connection.host}`);
    });

    mongoose.connection.on("error", (err) => {
      winston.error(`Error connecting to ${db_url}`, err);
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      winston.info("Mongoose disconnected through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.log(error);
  }
};
