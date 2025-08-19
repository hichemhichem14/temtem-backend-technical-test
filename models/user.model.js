const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../config");
const {
  documentToObject,
  getSchemaStaticsAndMethods,
  encodeSingleId,
} = require("./helpers.js");
const pick = require("lodash/pick");

/**
 * @typedef {typeof UserSchema} TUserSchema
 *
 *   We use this to define a temporary document for `this{}` definitions
 *
 * @typedef {import("./helpers").HydratedDocumentFromDefinition<typeof UserSchemaDefinition>} UserHydratedDocument
 */

const UserSchemaDefinition = /** @type {const} */ ({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    protected: true,
    private: true,
  },
  is_email_validated: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    required: true,
    default: "guest",
    enum: /** @type {const} */ (["owner", "guest"]),
  },
  last_logout_time: {
    type: Date,
  },
});

let UserSchema = new mongoose.Schema(UserSchemaDefinition, {
  ...getSchemaStaticsAndMethods(
    "User",
    {
      encodeDocument: encode,
    },
    {
      customMethods: {},
      customStatics: {},
    }
  ),
});

UserSchema.pre("save", function (next) {
  try {
    if (this.password && this.isModified("password")) {
      let hash = bcrypt.hashSync(this.password, config.security.bcryptRounds);
      this.password = hash;
    }
    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * @param {any} user
 * @returns {any}
 */
function encode(user) {
  const userObj = documentToObject(user, UserSchema);

  delete userObj.id;

  return {
    ...userObj,
    _id: encodeSingleId(userObj._id),
    // un-picking protected fields
    ...pick(
      userObj,
      Object.keys(UserSchema.obj).reduce((user, key, _) => {
        if (UserSchema.obj[key].protected) return user;
        return [...user, key];
      }, [])
    ),
  };
}

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
