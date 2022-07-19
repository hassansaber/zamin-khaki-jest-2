const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
booksData = require("../data/books.json");

const { save } = require("../services/save.service");
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

    const { name, author } = req.body;
    booksData.push({
      name,
      author,
      id: Math.random(),
    });

    const isSave = save(booksData);
    if (!isSave) {
      return res.status(500).json({
        error: true,
        message: "could not save book",
      });
    }

    res.json({
      message: "Success",
    });
  }
);

router.put("/:bookid", (req, res) => {
  // req.params is string
  const { bookid } = req.params;
  const { name, author } = req.body;

  const foundBook = booksData.find((book) => book.id == bookid);

  if (!foundBook) {
    return res.status(404).send({
      error: true,
      message: "Book not found",
    });
  }

  let updatedBook = null;
  const updatedBooks = booksData.map((book) => {
    if (book.id == bookid) {
      updatedBook = {
        ...book,
        name,
        author,
      };

      return updatedBook;
    }
    return book;
  });

  const isSave = save(updatedBooks);
  if (!isSave) {
    return res.status(500).json({
      error: true,
      message: "could not save book",
    });
  }

  res.status(201).json(updatedBook);
});

router.delete("/:bookid", (req, res) => {
  const { bookid } = req.params;

  const foundBook = booksData.find((book) => book.id == bookid);

  if (!foundBook) {
    return res.status(404).send({
      error: true,
      message: "Book not found",
    });
  }

  const updatedBooks = booksData.filter((book) => book.id != bookid);

  const isSave = save(updatedBooks);
  if (!isSave) {
    return res.status(500).json({
      error: true,
      message: "could not save book",
    });
  }

  res.status(201).json({
    message: "Success",
  });
});
//----
module.exports = router;
