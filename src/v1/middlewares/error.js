/* Catches errors to send them back */

module.exports = (error, _request, response, _) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Internal Server Error";

  response.status(error.statusCode).json({
    error: error.message,
  });
};
