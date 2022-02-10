const ErrorHandler = require('../../classes/ErrorHandler');

class ErrorReferenceNotFound extends ErrorHandler {
  constructor() {
    super('The reference was not found', 404);
  }
}
class ErrorReferencesNotFound extends ErrorHandler {
  constructor() {
    super('No references were found', 404);
  }
}

class ErrorReferencesThemesLimit extends ErrorHandler {
  constructor() {
    super("themes can be added a minimum of 1 to a maximum of 5!", 401);
  }
}


module.exports = {
  ErrorReferenceNotFound,
  ErrorReferencesNotFound,
  ErrorReferencesThemesLimit
}