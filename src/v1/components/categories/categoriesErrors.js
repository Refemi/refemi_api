const ErrorHandler = require("../../classes/ErrorHandler");

/* Sends back an error when a catgory does not exist */
class ErrorCategoriesNotFound extends ErrorHandler {
  constructor(statusCode = 404) {
    super("There are not active categories", statusCode);
  }
}

module.exports = {
  ErrorCategoriesNotFound,
};
