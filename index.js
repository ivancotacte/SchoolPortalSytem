// app.js

const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
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

const errorRoutes = require("./routes/errorRoutes");
const authRoutes = require("./routes/authRoutes"); // Import the new authRoutes file

app.set("view engine", "ejs");
app.use(express.json());
app.use(helmet());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoDBSession({
      uri: process.env.DB_URI,
      collection: "mySessions",
    }),
  })
);

app.use("/", errorRoutes);
app.use("/", authRoutes); // Use the authRoutes for authentication-related routes

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});