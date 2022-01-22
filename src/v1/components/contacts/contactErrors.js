const ErrorHandler = require("../../classes/ErrorHandler");

class ErrorNodeMailService extends ErrorHandler {
  constructor (error) {
    super(error);
  } 
}
class ErrorMailData extends ErrorHandler {
  constructor (mail) {
    super(Object
      .entries(mail).reduce((errorData, [field, value]) => {
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
