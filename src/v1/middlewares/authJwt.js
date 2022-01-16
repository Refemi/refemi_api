const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const ErrorHandler = require("../classes/ErrorHandler");

const JWT_SECRET = process.env.JWT_SECRET

dotenv.config({
  path: "../config.env",
});

const verifyToken = (request, _, next) => {
  try {
    const token = req.headers["x-access-token"];

    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        return next(new ErrorHandler('Invalid Token!', 401));
      }

      // TODO: Check if token is expired

      request.userID = decoded.id;
      next();
    });
  
  } catch (error) {
    // TODO: Error handling to return the correct message
    return next(new ErrorHandler('Invalid Token!', 401));
  }
}

module.exports = verifyToken;
