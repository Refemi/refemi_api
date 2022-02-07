const ErrorHandler = require("../../classes/ErrorHandler");

// If the login information, username, or password,
// does not match what is registered in the database
class ErrorUserCredential extends ErrorHandler {
  constructor() {
    super("Le nom d'utilisateur, ou le mot de passe est inccorect", 401);
  }
}
// If the sent password does not respect the rules of the regex
class ErrorUserPassword extends ErrorHandler {
  constructor() {
    super(`Le mot de passe doit avoir au moins 6 caractères, dont au moins une majuscule et une minuscule, et un chiffre, et un caractère spécial`, 401);
  }
}
// If the user or the email address already exists
class ErrorNewUser extends ErrorHandler {
  constructor() {
    super("Impossible de créer un compte avec ces informations", 409);
  }
}
class ErrorNewUserMissingCredential extends ErrorHandler {
  constructor() {
    super("Le nom d'utilisateur, le mot de passe, et le couriel sont requis", 400);
  }
}

module.exports = {
  ErrorHandler,
  ErrorUserCredential,
  ErrorUserPassword,
  ErrorNewUser,
  ErrorNewUserMissingCredential
};
