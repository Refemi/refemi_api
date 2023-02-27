const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const Postgres = new Pool();

const roles = require("../config/roles");

const checkRights = async (req, res, next) => {
  const data = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  req.cookies.jwtData = data;

  try {
    const user = await Postgres.query(
      'SELECT "user_role" FROM "users"WHERE "id"=$1',
      [data.id]
    );

    if (user.rows[0].user_role === 3) {
      next();
    } else {
      res.status(403).json({
        message: "Access denied",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
};

const isAdmin = (request, response, next) => {
  if (request.roleId === roles.ADMIN) {
    return next();
  }

  response.status(403).send({
    message: "Require Admin Role!",
  });
};

module.exports = {
  checkRights,
  isAdmin,
};
