const ErrorHandler = require("../../classes/ErrorHandler");

class ErrorFieldsNotFound extends ErrorHandler {
  constructor() {
    super("No field found", 404);
  }
}

module.exports = {
  ErrorFieldsNotFound,
};
