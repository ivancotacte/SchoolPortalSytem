const express = require("express");
const router = express.Router();

router.get("/404", (req, res) => {
  res.status(404).send("404 Page Not Found.");
});

module.exports = router;