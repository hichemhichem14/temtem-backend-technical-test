/** @extends Error */
class CodedError extends Error {
    /**
     * A container for all app errors
     *
     * @class
     * @param {string} code A key identifier for that error
     * @param {string} message The error message
     * @param {number} status The http code returned
     * @param {{ [key: string]: any }} [context] An object containing some useful debugging information
     */
    constructor(code, message, status = 500, context) {
        super(message);
        this.name = "APIError";
        this.code = code;
        this.status = status;
        this.context = context;
    }
}

module.exports = CodedError;
