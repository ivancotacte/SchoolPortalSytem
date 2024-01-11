const express = require("express");
const router = express.Router();

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    return next();
  } else {
    res.redirect("/login");
  }
};

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/404", (req, res) => {
  res.render("404");
});

router.get("/dashboard", isAuth, (req, res) => {
  res.render("dashboard");
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    return res.redirect("/login");
  });
});

module.exports = router;