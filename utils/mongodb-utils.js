const mongoose = require("mongoose");
const seededHashIds = require("seeded-hashids");

const scopes = [{ scope: "user", salt: process.env.HASH_IDS_SALT }];

/** @typedef {mongoose.Types.ObjectId} ObjectId */

/**
 * @param {string | mongoose.Types.ObjectId} str
 * @returns {mongoose.Types.ObjectId}
 */
const ObjectId = (str) => new mongoose.Types.ObjectId(str);

seededHashIds.initialize({
  scopes: scopes,
  objectId: ObjectId,
  minOutputLength: 24,
});

/**
 * @param {any} value
 * @returns {boolean}
 */
const isObjectId = (value) => {
  if (!value) return false;
  if (!mongoose.isValidObjectId(value)) {
    return false;
  }
  if (!value.toString().match(/^[0-9a-fA-F]{24}$/)) {
    return false;
  }
  return true;
};

/**
 * @param {(T | undefined)[]} arr
 * @returns {T[]}
 */
function filterUndefined(arr) {
  return arr?.filter((v) => v);
}

module.exports = {
  isObjectId,
  ObjectId,
  seededHashIds,
  filterUndefined,
};
