const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
require("dotenv").config();
require("ejs");

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
const port = process.env.PORT || 3000;

const UserModel = require("./models/Users");
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        return next();
    } else {
      res.redirect("/login");
    }
}

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: "ivancotacte",
    resave: false,
    saveUninitialized: false,
    store: new MongoDBSession({
      uri: process.env.DB_URI,
      collection: "mySessions",
    }),
}));

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
            return res.redirect("/login");
    });
});

app.get("/dashboard", isAuth, (req, res) => {
  res.render("dashboard");
});

app.get("/404", (req, res) => {
  res.status(404).send("404 Page Not Found.");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
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

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});