const { Pool } = require("pg");
const Postgres = new Pool();

class Users {
  async getAllUsers(request, response, next) {
    try {
      const userQuery = `
        SELECT *
        FROM users
        WHERE id = $1
      `;
      const userArgument = [request.params.id];
      const userResult = await Postgres.query(userQuery, userArgument);
      const user = userResult.rows[0];

      response.status(200).json({
        user: {
          userName: user.user_name,
          userEmail: user.user_email,
          userRole: user.user_role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Users();
