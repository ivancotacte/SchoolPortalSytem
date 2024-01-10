const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/Users");

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    return next();
  } else {
    res.redirect("/login");
  }
};

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    return res.redirect("/login");
  });
});

router.get("/dashboard", isAuth, (req, res) => {
  res.render("dashboard");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { emailaddress, password } = req.body;

  const user = await UserModel.findOne({ emailaddress });

  if (!user) {
    return res.status(400).send("Invalid email or password. 1");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Invalid email or password. 2");
  }

  req.session.isAuth = true;
  res.redirect("/dashboard");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { firstname, middlename, lastname, emailaddress, password } = req.body;

  let user = await UserModel.findOne({ emailaddress });
  if (user) {
    return res.status(400).send("Email address already exists.");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  user = new UserModel({
    firstname,
    middlename,
    lastname,
    emailaddress,
    password: hashPassword,
  });

  await user.save();

  res.redirect("/login");
});

module.exports = router;