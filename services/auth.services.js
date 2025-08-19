const CodedError = require("../commons/coded-error");
const config = require("../config");
const bcrypt = require("bcrypt");
const EmailValidationTokenModel = require("../models/email-validation-token.model");
const MailServices = require("./mail.services");
const pick = require("lodash/pick");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");

/** @class */
class AuthServices {
  /**
   *  @param {AppModels.UserObject}
   * @returns {string}
   */
  static generateJWT(user) {
    const payload = pick(user, config.security.jwtPayload);
    return jwt.sign(payload, config.security.jwtSecret, { expiresIn: "24h" });
  }
  /**
   *  @param {AppModels.UserObject} user
   * @param {string} password
   * @returns {Promise<any>}
   */
  static async comparePassword(user, password) {
    return new Promise((resolve, reject) => {
      if (!user.password) return false;

      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) reject(err);
        resolve(isMatch);
      });
    });
  }

  /**
   * @param {string} token
   * @returns {Promise<{ user: any; decoded: any }>}
   */
  static async getByToken(token) {
    try {
      const decodedToken = jwt.verify(token, config.security.jwtSecret);

      if (typeof decodedToken === "string") {
        throw new CodedError("auth.erroneous-token", "Invalid user token", 400);
      }

      if (
        !decodedToken.exp ||
        decodedToken.exp < Math.round(new Date().getTime() / 1000)
      ) {
        throw new CodedError("auth.erroneous-token", "User token expired", 400);
      }

      const decodedUser = pick(decodedToken, config.security.jwtPayload);

      // check that token has all payload keys
      if (
        !config.security.jwtPayload.every(
          (payloadKey) => payloadKey in decodedUser
        )
      )
        throw new CodedError(
          "auth.erroneous-token",
          "Invalid user token, Missing payload keys",
          400
        );

      const user = await UserModel.findOne(decodedUser).exec();

      if (user?.last_logout_time) {
        if (
          user.last_logout_time?.getTime() >
          new Date((decodedToken.iat ?? 1) * 1000).getTime()
        ) {
          throw new CodedError(
            "auth.erroneous-token",
            "The token is no longer valid. Please log in again.",
            400
          );
        }
      }

      return { user, decoded: decodedToken };
    } catch (error) {
      if (
        error.name === "TokenExpiredError" ||
        error.name === "JsonWebTokenError"
      )
        return Promise.reject(
          new CodedError("auth.erroneous-token", "Error On ", 400)
        );
      return Promise.reject(error);
    }
  }

  /**
   * @param {{email:string;password:string}} loginData
   * @returns {Promise<any>}
   */
  static async webLogin({ email, password }) {
    try {
      const user = await UserModel.findOne({
        email: email.toLowerCase().trim(),
      }).orFail(
        new CodedError("auth.invalid-credentials", "User email not found", 400)
      );

      let matchedPassword = await this.comparePassword(user, password);

      if (!matchedPassword) {
        throw new CodedError(
          "auth.invalid-credentials",
          "No user found with the provided email and password.",
          400
        );
      }

      if (!user.is_email_validated)
        new CodedError(
          "auth.email-not-verified",
          "User require email validation",
          400
        );

      return {
        ...UserModel.encode(user),
        token: this.generateJWT(user),
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @param {{ email: string }} params
   * @returns {Promise<boolean>}
   */
  static async validateSignUp({ email }) {
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser && existingUser.is_email_validated) {
      throw new CodedError(
        "auth.email-already-exists",
        "User email already exist",
        400
      );
    }

    return true;
  }

  /**
   * @param {{
   *     email: string;
   *     role?: string;
   *     password: string;
   * }} signupData
   * @returns {Promise< AppModels.UserObject; >}
   */
  static async signUp({ email, role, password }) {
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      if (existingUser.is_email_validated) {
        throw new CodedError(
          "auth.email-already-exists",
          "User email already exist",
          400
        );
      }

      existingUser.password = password;

      await existingUser.save();

      return existingUser;
    }

    const newUser = new UserModel({
      role: role,
      email: email.toLowerCase().trim(),
      password: password,
    });

    await newUser.save();

    return newUser;
  }

  /**
   * @param {AppModels.UserObject} user
   * @param {string} emailValidationToken
   * @returns {Promise<void>}
   */
  static async sendEmailValidationEmail(user, emailValidationToken) {
    await MailServices.sendEmailValidationEmail(
      user.email,
      emailValidationToken
    );
  }

  /** @param {AppModels.UserObject} user */
  static async createEmailValidationToken(user) {
    const token = new EmailValidationTokenModel({
      user_id: user._id,
      email: user.email,
      token:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      expires_at: new Date(
        Date.now() +
          config.security.emailValidationTokenExpiration * 24 * 60 * 60 * 1000
      ),
    });

    await token.save();

    return token;
  }

  /**
   * @param {string} token
   * @returns {Promise<any>}
   */
  static async validateEmailValidationToken(token) {
    const emailValidationToken = await EmailValidationTokenModel.findOne({
      token,
    });

    if (!emailValidationToken) {
      throw new CodedError(
        "auth.invalid-email-validation-token",
        "Token not found",
        400
      );
    }

    // check with expires_at
    if (emailValidationToken.expires_at < new Date()) {
      throw new CodedError(
        "auth.email-validation-token-expired",
        "Token expired",
        400
      );
    }

    // check with is_used
    if (emailValidationToken.is_used) {
      throw new CodedError(
        "auth.email-validation-token-used",
        "Token already used",
        400
      );
    }

    return emailValidationToken;
  }

  /**
   * @param {string} emailValidationToken
   * @returns {Promise<AppModels.UserObject>}
   */
  static async confirmUserEmail(emailValidationToken) {
    const user = await UserModel.findById(emailValidationToken.user_id);
    if (!user) {
      throw new CodedError(
        "auth.invalid-email-validation-token",
        "Invalid token",
        400
      );
    }

    if (user.is_email_validated) {
      throw new CodedError(
        "auth.email-already-validated",
        "User Email validation has already been completed",
        400
      );
    }

    user.is_email_validated = true;
    await user.save();

    emailValidationToken.is_used = true;
    await emailValidationToken.save();

    return user;
  }
}

module.exports = AuthServices;
