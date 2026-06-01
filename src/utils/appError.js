class appError extends Error {
  constructor(statusCode, message = "Something went wrong") {
    super(message);

    // Controllers throw this so the global error handler can choose the status.
    this.statusCode = statusCode;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default appError;
