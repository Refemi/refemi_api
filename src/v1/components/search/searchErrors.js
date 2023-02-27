const ErrorHandler = require("../../classes/ErrorHandler");

class ErrorSearchNoResult extends ErrorHandler {
  constructor() {
    super("This search result does not exist in the database", 404);
  }
}

module.exports = {
  ErrorHandler,
  ErrorSearchNoResult,
};
