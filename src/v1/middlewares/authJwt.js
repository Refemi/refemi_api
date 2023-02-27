const dotenv = require("dotenv");
dotenv.config({
  path: "../config.env",
});

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const ErrorHandler = require("../classes/ErrorHandler");

const verifyToken = (request, _, next) => {
  try {
    const token = request.headers["x-access-token"];
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        if (error.expiredAt) {
          throw new ErrorHandler("Token expired", 498);
        } else {
          throw new ErrorHandler("Invalid Token!", 401);
        }
      }

      request.userId = decoded.id;
      request.roleId = decoded.role;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;
