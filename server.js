const config = require("./config");
const express = require("express");
const app = express();
//const JobService = require("./services/jobs.services");

require("./startup/db.startup")();
require("./startup/config.startup")(app);

require("./startup/routes.startup")(app);

const server = app.listen(config.env.port, () => {
  console.log("Server started on port ", config.env.port);
});

module.exports = server;
