// PostGreSQL dependencies
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// Import User Class
const { User } = require("./auth");

// Handle errors
const {
  ErrorHandler,
  ErrorUserPassword,
  ErrorUserCredential,
  ErrorUserAlreadyExist,
  ErrorNewUserMissingCredential
} = require("./authErrors");

/**
 * @description Authentification Class
 */
class Auth {
  /**
   * Add one user
   * @param {string} request.body.name - user name
   * @param {string} request.body.mail - user mail
   * @param {string} request.body.password - user password hashed
   * @route POST /api/v1/auth/signUp
   */
  async addOneUser(request, response, next) {
    try {
      const { userName, userEmail, userPassword } = request.body;
      
      if (!userName || !userEmail || !userPassword) {
        throw new ErrorNewUserMissingCredential()
      }
      // Regex : needs at least a number and 6 characters
      const passwordRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
      const isValidPassword = passwordRegex.test(userPassword);
      if (!isValidPassword) {
        throw new ErrorUserPassword();        
      }

      // Verify if user already exists before creating it
      const userQuery = `SELECT * FROM "users" WHERE "user_email" = $1`;
      const userArgument = [userEmail];
      const userResult = await Postgres.query(userQuery, userArgument);

      if (userResult.rows.length > 0) {
        throw new ErrorUserAlreadyExist();
      }

      const NewUser = new User(userName, userEmail);
      NewUser.password = await NewUser.encryptPassword(userPassword);

      const addUserQuery = `
        INSERT INTO "users" ("user_name", "user_email", "user_password")
        VALUES ($1, $2, $3)
      `;
      const addUserArguments = [NewUser.name, NewUser.email, NewUser.password];

      await Postgres.query(addUserQuery, addUserArguments);

      response.status(201).json({
        message: `L'utilisateur a bien été créé`,
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Check if user is still authentificated to enable verifyToken() to work
   * @param {string} request.body.mail - user mail
   * @param {string} request.body.password - user password hashed
   */
  async checkAuth(_, response, next) {
    try {
      response.status(200).json({});
    } catch (error) {
      next(error);
    }
  }
  /**
   * Authentification
   * @param {string} request.body.email - user mail
   * @param {string} request.body.password - user password hashed
   * @route POST /api/v1/auth/signIn
   */
  async logIn (request, response, next) {
    try {
      const { userEmail, userPassword } = request.body;
      const userRequest = `
        SELECT * FROM "users" WHERE user_email= $1
      `;
      const userResult = await Postgres.query(userRequest, [userEmail]);
      if (userResult.rows.length === 0) {
        throw new Error();
      }

      // User object construction
      const UserDB = new User(
        userResult.rows[0].user_name,
        userResult.rows[0].user_email,
        userResult.rows[0].user_password,
        userResult.rows[0].id,
        userResult.rows[0].user_role
      );

      // Checks if the sent password matches the registered one
      const isAllow = await UserDB.checkCredentials(userPassword);

      if (!isAllow) {
        throw new ErrorUserCredential();
      } else {
        UserDB.token = UserDB.getNewToken();
        response.status(200).json({
          user: UserDB.getCredentials(),
          accessToken: UserDB.token,
        });
      }
    } catch (error) {
      if (error instanceof ErrorUserCredential) {
        next(error)
      } else {
        next(new ErrorHandler('Impossible de se connecter', 403));
      }
    }
  }
}

module.exports = new Auth();
