//erquire("dotenv-safe").config();
const config = require("../config");
const nodemailer = require("nodemailer");

transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});
class MailServices {
  /**
   * @param {string} userEmail
   * @param {string} emailValidationToken
   * @returns {void}
   */
  static async sendEmailValidationEmail(userEmail, emailValidationToken) {
    const url = `${process.env.CLIENT_URL}/verify-email?token=${emailValidationToken}`;

    await transporter.sendMail({
      from: `"Store App" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Email Verification",
      html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
    });
  }
}

module.exports = MailServices;
