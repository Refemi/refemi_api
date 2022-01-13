const jwt = require("jsonwebtoken");
const killCookie = require("../utils/killCookie");

const protect = (req, res, next) => {
  try {
    const data = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    // console.log("data",data)
    req.cookies.jwtData = data;
    if (Date.now() === data.exp * 1000) {
      killCookie();

      return res.status(403).json({
        message: " invalid sesion",
      });
    }
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Your token is not valid",
    });
  }
};

module.exports = { protect };
