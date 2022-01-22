const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

const roles = require('../config/roles');

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
    return next()
  }

  response.status(403).send({
    message: "Require Admin Role!",
  });
};

const isModerator = (req, res, next) => {
  // Check with postGre if the user is modo

  res.status(403).send({
    message: "Require Moderator Role!",
  });
};

const canModerate = (req, res, next) => {
  // Check the user's role type

  res.status(403).send({
    message: "Require Moderator or Admin Role!",
  });
};


module.exports = {
  checkRights,
  isAdmin,
  isModerator,
  canModerate
};
