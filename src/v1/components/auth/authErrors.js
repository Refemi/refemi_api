const ErrorHandler = require("../../classes/ErrorHandler");

class ErrorUserNotFound extends ErrorHandler {
  constructor() {
    super("User not found", 404);
  }
}

class ErrorUserCredential extends ErrorHandler {
  constructor() {
    super("User credentials is incorrect", 401);
  }
}

class ErrorUserPassword extends ErrorHandler {
  constructor() {
    super("User credentials is incorrect", 401);
  }
}

class ErrorUserExist extends ErrorHandler {
  constructor() {
    super("User already exists", 409);
  }
}

module.exports = {
  ErrorHandler,
  ErrorUserNotFound,
  ErrorUserCredential,
  ErrorUserPassword,
  ErrorUserExist,
};
