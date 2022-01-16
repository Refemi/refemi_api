const ErrorHandler = require("../../classes/ErrorHandler");

class ErrorCategoriesNotFound extends ErrorHandler {
  constructor (statusCode = 404) {
    super("There are not active categories", statusCode);
  } 
}

module.exports = {
  ErrorCategoriesNotFound
}
