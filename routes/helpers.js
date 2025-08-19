const { ErrorHandlerServices } = require("../services");
const modelsHelpers = require("../models/helpers");
const CodedError = require("../commons/coded-error");
const path = require("path");
const fs = require("fs");
const winston = require("winston");
const { ObjectId, isObjectId } = require("../utils/mongodb-utils");

/**
 * Parses from request's query params standard params for sorting and pagination
 *
 * @param {Request} req
 * @returns {{ sortOptions: { [field: string]: -1 | 1 }}}
 */
const parsePaginationQueryParams = (req) => {
  const { order, order_by: orderBy } = req.query;

  /** @type {{ [field: string]: -1 | 1 }} */
  let sortOptions = {};

  let orderKey = orderBy?.toString();

  // Set the sorting order based on 'order' parameter
  if (orderKey) {
    if (order === "desc") {
      sortOptions[orderKey] = -1;
    } else {
      sortOptions[orderKey] = 1;
    }
  }

  return { sortOptions };
};

const parseQueryParams = (req, keys) => {
  return keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: req.query[key] ? req.query[key].toString() : undefined,
    }),
    {}
  );
};

/**
 * Parses a path parameter to ObjectId or throws an error if it's null or not an objectId
 *
 * @param {Request} req
 * @param {string} paramKey
 * @returns {import("mongoose").Types.ObjectId}
 * @throws {CodedError} If the parameter is null, undefined, or not a valid ObjectId
 */
const parsePathParamObjectId = (req, paramKey) => {
  const param = req.params[paramKey];

  if (!param) {
    throw new CodedError(
      "bad-request.missing-param",
      `Missing path parameter '${paramKey}'`,
      400
    );
  }

  if (!isObjectId(param)) {
    throw new CodedError(
      "bad-request.invalid-param",
      `Invalid ObjectId format for '${paramKey}'`,
      400
    );
  }

  return ObjectId(param);
};

/**
 * @param {Response} res
 * @param {{ data: any; message: string }} body
 * @returns {Response}
 */
const successResponse = (res, { data, message }) =>
  res.json({
    code: 200,
    status: 200,
    message,
    data,
  });

/**
 * @template T
 * @param {(req: Request, res: Response, next: NextFunction) => Promise<T> | T} fn
 * @returns {(req: Request, res: Response, next: NextFunction) => Promise<T | void>}
 */
const asyncErrorWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (err) {
      if (err instanceof CodedError) {
        return next(err);
      }
      console.log(err);
      return next(new CodedError("unknow_error", "Internal error", 500));
    }
  };
};

module.exports = {
  parsePaginationQueryParams,
  parseQueryParams,
  parsePathParamObjectId,
  successResponse,
  asyncErrorWrapper,
  parseQueryParams,
};
