const ErrorHandler = require('../../classes/ErrorHandler');

class ErrorReferenceNotFound extends ErrorHandler {
  constructor() {
    super('Reference not found', 404);
  }
}
module.exports = {
  ErrorReferenceNotFound
}