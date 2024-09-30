const express = require("express");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const isUserLoggedIn = require("../middleware/user");
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).lean();
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username,
        password: hashedPassword,
      });
      return res.json({ message: "success" });
    } else {
      return res.json({ message: "user already exist" });
    }
  } catch (error) {
    res.json(error);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res.json({ message: "User is not registered" });
    }
    const decryptPassword = await bcrypt.compare(password, user.password);
    if (!decryptPassword) {
      return res.json({ message: "Invalid Password" });
    }
    const jwToken = jwt.sign(user, "secreat");
    res.json({ message: "success", token: jwToken });
  } catch (error) {
    res.json(error);
  }
});

userRouter.get("/getUser", isUserLoggedIn, (req, res) => {
  res.json(req.user);
});

userRouter.get("/user/:userID", async (req, res) => {
  const { userID } = req.params;
  try {
    const userDetails = await User.findById(userID);
    res.send(userDetails);
  } catch (error) {
    res.send(error);
  }
});

module.exports = userRouter;
