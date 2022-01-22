const ErrorHandler = require('../../classes/ErrorHandler');

class ErrorThemesExist extends ErrorHandler {
  constructor() {
    super('Reference already exist', 409);
  }
}
class ErrorThemesNotFound extends ErrorHandler {
  constructor() {
    super('Reference not found', 404);
  }
}


module.exports = {
  ErrorHandler,
  ErrorThemesExist,
  ErrorThemesNotFound
}
