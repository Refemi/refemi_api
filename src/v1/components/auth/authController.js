// PostGreSQL dependencies
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

const { User } = require("./auth");

const {
  ErrorHandler,
  ErrorUserNotFound,
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
  async addOneUser(request, response) {
    try {
      const { name, mail, password } = request.body;
      // Regex : needs at least a number and 6 characters
      const passwordValid = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,50})$/;
      const passwordTest = passwordValid.test(password);

      // Verify if user already exists before creating it
      const userQuery = `SELECT * FROM "users" WHERE "user_mail" = $1`;
      const userArgument = [mail];
      const user = await Postgres.query(userQuery, userArgument);

      if (user.rows.length === 0 && passwordTest) {
        const salt = await bcrypt.genSalt(12);
        const bcryptPassword = await bcrypt.hash(password, salt);

        const addUserQuery =
          'INSERT INTO "users" ("user_name", "user_mail", "user_password") VALUES ($1, $2, $3)';
        const addUserArguments = [name, mail, bcryptPassword];

        await Postgres.query(addUserQuery, addUserArguments);

        response.status(201).json({
          message: `New user has been created`,
        });
      }
    } catch (error) {
      next(ErrorUserExist());
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
   * @param {string} request.body.mail - user mail
   * @param {string} request.body.password - user password hashed
   */
  async logIn(request, response, next) {
    try {
      const { mail, password } = request.body;
      const userRequest = `
        SELECT * FROM "users" WHERE user_mail= $1
      `;
      const userResult = await Postgres.query(userRequest, [mail]);

      if (userResult.rows.length === 0) {
        throw new ErrorUserNotFound();
      }

      const user = new User(userResult.rows[0]);

      if (!user.checkCredentials(password)) {
        throw new ErrorUserCredential();
      }

      response.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken: user.getNewToken(),
      });
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
}

module.exports = new Auth();
