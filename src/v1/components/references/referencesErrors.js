const ErrorHandler = require('../../classes/ErrorHandler');

class ErrorReferenceNotFound extends ErrorHandler {
  constructor() {
    super('La référence n\'a pas été trouvée', 404);
  }
}
class ErrorReferenceAlreadyExist extends ErrorHandler {
  constructor() {
    super('La référence existe déjà', 409);
  }
}
class ErrorReferencesNotFound extends ErrorHandler {
  constructor() {
    super('Aucune référence n\'a été trouvée', 404);
  }
}

class ErrorReferencesThemesLimit extends ErrorHandler {
  constructor() {
    super("themes can be added a minimum of 1 to a maximum of 5!", 401);
  }
}


module.exports = {
  ErrorReferenceNotFound,
  ErrorReferenceAlreadyExist,
  ErrorReferencesNotFound,
  ErrorReferencesThemesLimit
}