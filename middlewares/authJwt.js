const jwt = require("jsonwebtoken");

verifyToken = (res, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided",
    });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    req.userID = decoded.id;
    next();
  });
};

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
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
};
