const jwt = require("jsonwebtoken");

const isUserLoggedIn = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      res.json({ message: "Authorization failed" });
    }
    const user = jwt.verify(token, "secreat");
    req.user = user;
    next();
  } catch (error) {
    res.json(error);
  }
};

module.exports = isUserLoggedIn;
