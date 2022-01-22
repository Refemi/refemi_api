const ErrorHandler = require("../../classes/ErrorHandler");

class ErrorReferencesNotFound extends ErrorHandler {
  constructor() {
    super('No references were found', 404);
  }
}

module.exports = {
  ErrorHandler,
  ErrorReferencesNotFound
}