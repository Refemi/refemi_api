const ErrorHandler = require('../../classes/ErrorHandler');

class ErrorSectionNotFound extends ErrorHandler {
  constructor() {
    super("There are no registered sections", 404);
  }
}


module.exports = {
  ErrorSectionNotFound
}