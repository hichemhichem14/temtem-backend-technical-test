const {
  ObjectId,
  isObjectId,
  seededHashIds,
} = require("../utils/mongodb-utils");

const decodeIdsMiddleware = (req, _res, next) => {
  const params = req.params;

  // map each params element
  for (const key in params) {
    // if the key is an ObjectId
    // .match(/^[0-9a-fA-F]{24}$)/
    if (
      typeof params[key] === "string" &&
      params[key].length === 24 &&
      isObjectId(seededHashIds.decodeHex("user", params[key]))
    ) {
      // decode the ObjectId
      const decoded = seededHashIds.decodeHex("user", params[key]);
      req.params[key] = decoded;
    }
  }
  return next();
};

module.exports = decodeIdsMiddleware;
