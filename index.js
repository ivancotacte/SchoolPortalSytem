const express = require("express");
const { check, validationResult } = require("express-validator");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
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

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoDBSession({
      uri: process.env.DB_URI,
      collection: "sessions",
    }),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  }),
);


const mainRoutes = require("./routes/mainRoutes");
const UserModel = require("./models/Users");

app.use("/", mainRoutes);

app.get("/register", (req, res) => {
  res.render("register", { errors: "" });
});
app.post(
  "/register",
  [
    check("firstName").notEmpty().withMessage("First name field is required"),
    check("middleName").notEmpty().withMessage("Middle name field is required"),
    check("lastName").notEmpty().withMessage("Last name field is required"),
    check("contactNum")
      .notEmpty()
      .withMessage("Contact # field is required")
      .isLength({ min: 11 })
      .withMessage("Your Contact# must be at least 11 numbers"),
    check("semester").notEmpty().withMessage("Semester field is required"),
    check("schoolyear").notEmpty().withMessage("School year field is required"),
    check("emailAddress")
      .isEmail()
      .notEmpty()
      .withMessage("Email field is required"),
    check("password")
      .notEmpty()
      .withMessage("Password field is required")
      .isLength({ min: 8 })
      .withMessage("Your password must be at least 8 characters"),
  ],
  async (req, res) => {
    const {
      firstName,
      middleName,
      lastName,
      suffix,
      contactNum,
      campus,
      semester,
      schoolyear,
      emailAddress,
      password,
    } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("register", { errors: errors.mapped() });
      console.log(errors.mapped());
      return;
    }

  let userEmail = await UserModel.findOne({ emailAddress });
  if (userEmail) {
    return res.render("register", { errors: "Email address already exists." });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  userEmail = new UserModel({
    firstName,
    middleName,
    lastName,
    suffix,
    contactNum,
    campus,
    semester,
    schoolyear,
    emailAddress,
    password: hashPassword,
  });

  await userEmail.save();
  res.redirect("/login");
  }
);

app.get("/login", (req, res) => {
  res.render("login", { errors: "" });
});
app.post(
  "/login",
  [
    check("emailAddress")
      .isEmail()
      .withMessage("Invalid email address")
      .notEmpty()
      .withMessage("Email field is required"),
    check("password")
      .notEmpty()
      .withMessage("Password field is required")
      .isLength({ min: 8 })
      .withMessage("Your password must be at least 8 characters"),
  ],
  async (req, res) => {
    const { emailAddress, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("login", { errors: errors.mapped() });
      console.log(errors.mapped());
      return;
    }

    const user = await UserModel.findOne({ emailAddress });
    if (!user) {
      return res.render("login", { errors: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", { errors: "Invalid email or password" });
    }

    req.session.isAuth = true;
    res.redirect("/dashboard");
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
