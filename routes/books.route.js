const express = require("express");
const router = express.Router();
booksData = require("../data/books.json");

//----

router.get("/", (req, res) => {
  res.json(booksData);
});

//----
module.exports = router;
