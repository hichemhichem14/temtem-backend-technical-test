const config = require("config");
var enforce = require("express-sslify");

module.exports = function (app) {
  // check if jwt is set
  if (!config.get("jwt_secret")) {
    throw new Error("FATAL ERROR: jwt_secret is not defined.");
  }

  // force HTTPS when environment is production
  if (config.get("node_env") === "production") {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
  }
};
