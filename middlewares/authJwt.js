const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({
  path: "../config.env",
});
verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
    console.log("t", token)
    try {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    req.userID = decoded.id;
    next();
  });
   
  } catch (error) {

    return res.status(400).json({
      message: "Problème d'identifiant",
    });
  }
}

isAdmin = (req, res, next) => {
  // Vérifier avec postGre si l'utilistateur est admin

  res.status(403).send({
    message: "Require Admin Role!",
  });

  return;
};

isModerator = (req, res, next) => {
  // Vérifier avec postGre si l'utilisateur est modo

  res.status(403).send({
    message: "Require Moderator Role!",
  });
};

isModeratorOrAdmin = (req, res, next) => {
  // Vérifier le type du rôle de l'utilisateur

  res.status(403).send({
    message: "Require Moderator or Admin Role!",
  });
};

module.exports = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
};
