const jwt = require("jsonwebtoken");
//Middleware function for private routes
module.exports = function (req, res, next) {
  const { token } = req.cookies;
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
