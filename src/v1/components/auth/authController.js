// PostGreSQL dependencies
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// Import User Class
const { User } = require("./auth");

// Handle errors
const {
  ErrorHandler,
  ErrorUserNotFound,
  ErrorUserPassword,
  ErrorUserCredential,
  ErrorUserExist,
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
   */
  async addOneUser(request, response, next) {
    try {
      const { userName, userEmail, userPassword } = request.body;

      // Regex : needs at least a number and 6 characters
      const passwordValid = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
      const passwordTest = passwordValid.test(userPassword);
      if (!passwordTest) {
        throw new ErrorUserPassword();
      }
      // Verify if user already exists before creating it
      const userQuery = `
        SELECT *
        FROM "users"
        WHERE "user_email" = $1
      `;
      const userArgument = [userEmail];
      const userResult = await Postgres.query(userQuery, userArgument);
      console.log(userResult.rows)
      if (userResult.rows.length === 0) {
        const UserAuth = new User(userName, userEmail)
        console.log(UserAuth)
        const hashedPassword = await UserAuth.hashPassword(userPassword);
        const addUserQuery = `
          INSERT INTO "users" ("user_name", "user_email", "user_password")
          VALUES ($1, $2, $3);
        `;
        const addUserArguments = [UserAuth.userName, UserAuth.userEmail, hashedPassword];
        console.log(addUserArguments)
        const addUserResult = await Postgres.query(addUserQuery, addUserArguments);


        response.status(201).json({
          message: `New user has been created`,
        });
      }
    } catch (error) {
      console.log(error)
      if (error instanceof ErrorUserPassword) {
        next(new ErrorUserPassword());
      } else {
        next(new ErrorHandler('', 403));
      }
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
      if (
        error instanceof ErrorUserNotFound ||
        error instanceof ErrorUserCredential ||
        error instanceof ErrorUserExist
      ) {
        next(error);
      } else {
        next(new ErrorHandler(error.message, error.status));
      }
    }
  }
  /**
   * Authentification
   * @param {string} request.body.email - user mail
   * @param {string} request.body.password - user password hashed
   */
  async logIn (request, response, next) {
    try {
      console.log(request.body)
      const { email, password } = request.body;
      const userRequest = `
        SELECT *
        FROM "users"
        WHERE user_email = $1
      `;
      
      const userResult = await Postgres.query(userRequest, [email]);
      if (userResult.rows.length === 0) {
        throw new Error();
      }
      
      const { id, user_name, user_email, user_role, user_password } = userResult.rows[0];
      const UserAuth = new User(user_name, user_email, id, user_role, user_password);

      const isPasswordValid = await UserAuth.checkCredentials(password)
      if (!isPasswordValid) {
        throw new ErrorUserCredential();
      } else {
        console.log(UserAuth.getCredentials())
        response.status(200).json({
          user: UserAuth.getCredentials(),
          accessToken: UserAuth.getNewToken(),
        });
      }
    } catch (error) {
      if (error instanceof ErrorUserPassword) {
        next(error)
      } else {
        console.log(error)
        next(new ErrorHandler('Impossible de se connecter', 403));
      }
    }
  }
}

module.exports = new Auth();
