const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

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

module.exports = { checkRights };
