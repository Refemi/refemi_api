const ErrorHandler = require('../../classes/ErrorHandler');

class ErrorUserNotFound extends ErrorHandler {
  constructor() {
    super('User not found', 404);
  }
}

class ErrorUserCredential extends ErrorHandler {
  constructor() {
    super('User credential is incorrect', 401);
  }
}

class ErrorBadUserPassword extends ErrorHandler {
  constructor() {
    super('User password is incorrect', 401);
  }
}

class ErrorUserExist extends ErrorHandler {
  constructor() {
    super('User already exist', 409);
  }
}

module.exports = {
  ErrorUserNotFound,
  ErrorUserCredential,
  ErrorUserExist
}
