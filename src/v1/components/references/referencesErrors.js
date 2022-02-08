const ErrorHandler = require('../../classes/ErrorHandler');

class ErrorReferenceNotFound extends ErrorHandler {
  constructor() {
    super('The reference was not found', 404);
  }
}
class ErrorReferencesNotFound extends ErrorHandler {
  constructor() {
    super('No references were found', 204);
  }
}

class ErrorReferencesThemesLimit extends ErrorHandler {
  constructor() {
    super("themes can be added a minimum of 1 to a maximum of 5!", 401);
  }
}

class ErrorReferenceExist extends ErrorHandler {
  constructor() {
    super('La référence existe déjà', 409);
  }
}


module.exports = {
  ErrorReferenceNotFound,
  ErrorReferencesNotFound,
  ErrorReferencesThemesLimit,
  ErrorReferenceExist
}