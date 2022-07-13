const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
booksData = require("../data/books.json");

//----

router.get("/", (req, res) => {
  res.json(booksData);
});

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("author", "Author is required").not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
  }
);

//----
module.exports = router;
