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


module.exports = {
  ErrorReferenceNotFound,
  ErrorReferencesNotFound
}