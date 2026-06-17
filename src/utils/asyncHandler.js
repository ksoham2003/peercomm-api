/**
 * Higher-order function to wrap async route handlers
 * Automatically catches errors and passes them to Express error middleware
 * @param {Function} handlerController - Async controller function (req, res, next) => Promise
 * @returns {Function} Express middleware that handles async errors
 */
const asyncHandler = (handlerController) => {
  // Forward rejected promises to Express error middleware.
  return (req, res, next) =>
    Promise.resolve(handlerController(req, res, next)).catch(next);
};

export default asyncHandler;
