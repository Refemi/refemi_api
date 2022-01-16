const ErrorHandler = require('../../classes/ErrorHandler');

class ErrorThemeNotFound extends ErrorHandler {
  constructor() {
    super('Reference not found', 404);
  }
}
module.exports = {
    ErrorThemeNotFound
}