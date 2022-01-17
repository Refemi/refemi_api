const dotenv = require("dotenv");
dotenv.config({
  path: "../config.env",
});

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET

const ErrorHandler = require("../classes/ErrorHandler");


const verifyToken = (request, _, next) => {
  try {
    const token = request.headers["x-access-token"];

    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        throw new ErrorHandler('Invalid Token!', 401);
      }

      // TODO: Check if token is expired
      request.userId = decoded.id;
      request.roleId = decoded.role;
      next();
    });
  
  } catch (error) {
    // TODO: Error handling to return the correct message
    next(new ErrorHandler('Invalid Token!', 401));
  }
}


module.exports = verifyToken;
