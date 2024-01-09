const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const port = 3000;

app.set("view engine", "ejs");

mongoose.connect(
  "mongodb+srv://ivancotacte:4OzdibUsUu0X8rNx@ivancluster.baex3qi.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/404", (req, res) => {
  res.render("404");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
