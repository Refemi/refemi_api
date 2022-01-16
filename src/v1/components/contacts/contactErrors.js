const ErrorHandler = require("../../classes/ErrorHandler");

class ErrorNodeMailService extends ErrorHandler {
  constructor (statusCode = 404) {
    super("There are not active categories", statusCode);
  } 
}

class ErrorMailData extends ErrorHandler {
  constructor (data) {
    super(Object
      .entries(data).reduce((errorData, [field, value]) => {
        if (value) {
          errorData.push({
            [field]: value
          })
        }

        return errorData
      }, []),
    statusCode);
  }
}

module.exports = {
    ErrorNodeMailService,
    ErrorMailData
}
