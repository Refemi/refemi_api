const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

const express = require("express");
const router = express.Router();

class Users {
  async getOneById(request, response, next) {
    try {
      response.status(200).json({
        message: "ok"
      });
    } catch (error) {
      next(error);
    }
  }
  async getAll(request, response, next) {
    try {
      const userQuery = `
          SELECT * FROM users WHERE id = $1
      `;
      const userArgument = [request.params.id];
      const userResult = await Postgres.query(userQuery, userArgument);
      const user = userResult.rows[0];

      response.status(200).json({
          user: user
      });
    } catch (error) {
      next(error);
    }
  }
  async getOwn(request, response, next) {
    try {
      const userQuery = `
        SELECT * FROM users WHERE id = $1
      `;
      const userArgument = [request.userId];
      const userResult = await Postgres.query(userQuery, userArgument);
      const user = userResult.rows[0];

      response.status(200).json({
        user: {
          user_name: user.user_name,
          user_mail: user.user_mail,
          user_role: user.user_role
        }
      });
    } catch (error) {
      next(error);
    }
  }
}



module.exports = new Users();