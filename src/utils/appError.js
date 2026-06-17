/**
 * Custom error class for application errors
 * Allows controllers to throw errors with specific status codes and messages
 * Caught by global error middleware and sent to client
 */
class appError extends Error {
  /**
   * Create an application error
   * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
   * @param {string} message - Error message to send to client
   */
  constructor(statusCode, message = "Something went wrong") {
    super(message);

    // Controllers throw this so the global error handler can choose the status.
    this.statusCode = statusCode;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default appError;
