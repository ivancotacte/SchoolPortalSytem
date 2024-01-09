const express = require('express');
require('dotenv').config();
require('ejs');

const app = express();
const port = 3000 || process.env.PORT;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get('/404', (req, res) => {
    res.render('404');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});