const CodedError = require("../commons/coded-error");
const mongoose = require("mongoose");
const _ = require("lodash");

const { seededHashIds } = require("../utils/mongodb-utils");
/**
 * @type {((input: import("mongoose").Types.ObjectId | undefined | null) => string) &
 *     ((input: string | undefined) => string | undefined)}
 */
function encodeSingleId(value) {
  if (!value) return value;
  return seededHashIds.encodeHex("user", value.toString());
}

/**
 * @template T
 * @param {T} doc
 * @param {any} _
 * @returns {any}
 */
function defaultEncode(doc, _) {
  return {
    ...documentToObject(doc),
    // @ts-ignore
    _id: doc._id ? encodeSingleId(doc._id) : undefined,
  };
}

/**
 * @param {string} modelName
 * @param {{
 *     encodeDocument?: (doc: TObjectDoc, options?: EncodeOptions) => R;
 * }} statics
 * @param {{ customStatics: TCustomStatics; customMethods: TCustomMethods }} customStaticsAndMethods
 * @returns {{
 *     methods: TCustomMethods & AppModelsMethods<EncodeOptions, R>;
 *     statics: TCustomStatics & AppModelsStatics<TObjectDoc, EncodeOptions, R>;
 * }}
 */
function getSchemaStaticsAndMethods(
  modelName,
  { encodeDocument },
  customStaticsAndMethods
) {
  const encodeFn = encodeDocument ?? defaultEncode;

  const errors = {
    not_found: () =>
      new CodedError(
        `${modelName.toLowerCase()}.not_found`,
        `${modelName} not found`,
        404
      ),
    creation_error: () =>
      new CodedError(
        `${modelName.toLowerCase()}.creation_error`,
        `Could not create ${modelName}`,
        400
      ),
  };

  return {
    statics: {
      apiErrors: errors,
      encode: encodeFn,
      ...customStaticsAndMethods?.customStatics,
    },
    methods: {
      toEncoded:
        /**
         * @param {EncodeOptions} [options]
         * @returns {R}
         * @this {TObjectDoc}
         */
        function (options) {
          return encodeFn(this, options);
        },
      ...customStaticsAndMethods?.customMethods,
    },
  };
}

function _isFieldPrivate(schema, field) {
  const fieldDefinition = schema.obj[field];

  if (Array.isArray(fieldDefinition)) return fieldDefinition[0].private;

  return fieldDefinition.private;
}

function _filterPrivateFields(obj, schema) {
  if (!schema) return obj;

  // Omit removes only private keys, to keep keys such as _id which are not in the schema
  return _.omit(
    obj,
    Object.keys(schema.obj).filter((key) => _isFieldPrivate(schema, key))
  );
}

/**
 * @template T
 * @param {mongoose.HydratedDocument<T> | any} document
 * @param {mongoose.Schema} [schema]
 * @returns {any}
 */
function documentToObject(document, schema) {
  if (!document) return document;

  if (document.toObject) {
    const obj = document.toObject({ flattenMaps: true, minimize: false });
    delete obj.id;
    delete obj.__v;
    delete obj.__t;

    return _filterPrivateFields(obj, schema);
  }

  delete document.__v;
  delete document.__t;

  return _filterPrivateFields(document, schema);
}

module.exports = {
  getSchemaStaticsAndMethods,
  documentToObject,
  encodeSingleId,
};
