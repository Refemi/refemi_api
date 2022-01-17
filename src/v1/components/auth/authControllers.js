// PostGreSQL dependencies
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

const { User } = require('./auth')

const {
  ErrorHandler,
  ErrorUserNotFound,
  ErrorUserCredential,
  ErrorUserExist
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
  async addOne (request, response) {
    try {
      const { name, mail, password } = request.body;
      // Regex : needs at least a number and 6 characters
      const passwordValid = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,50})$/;
      const passwordTest = passwordValid.test(password);

      const user = await Postgres.query(`
        SELECT * FROM "users" WHERE "user_mail" = $1
      `, [mail]
      );

      if (user.rows.length === 0 && passwordTest) {
        const salt = await bcrypt.genSalt(12);
        const bcryptPassword = await bcrypt.hash(password, salt);

        await Postgres.query(
          'INSERT INTO "users" ("user_name", "user_mail", "user_password") VALUES ($1, $2, $3)',
          [name, mail, bcryptPassword]
        );

        response.status(201).json({
          message: `New user has been createded`,
        });
      }
    } catch (error) {
      next(ErrorUserExist());
    }
  }
  /**
   * Add one user
   * @param {string} request.body.mail - user mail
   * @param {string} request.body.password - user password hashed
   */
   async getOne (request, response, next) {
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

      if (!(await user.valideCredentials(password))) {
        throw new ErrorUserCredential();
      }

      response.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken: user.newToken(),
      });
    } catch (error) {
      if (
        error instanceof ErrorUserNotFound || 
        error instanceof ErrorUserCredential ||
        error instanceof ErrorUserExist
      ) { next(error) } else {
        next(new ErrorHandler(error.message, error.status));
      }
    }
  }
}


module.exports = new Auth();
