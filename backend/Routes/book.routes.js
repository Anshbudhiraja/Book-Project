const express = require("express");
const { addBook, getBooks, updateBook, deleteBook, getAllBooks, getBook } = require("../controller/BookController/book.controller");
const { userMiddleware } = require("../middlewares/user.middleware");

const router = express.Router();

router.post("/add", userMiddleware, addBook);
router.get("/", userMiddleware, getBooks);
router.get("/getBook/:bookId", userMiddleware, getBook);
router.get("/getAllBooks", getAllBooks);
router.put("/update/:id", userMiddleware, updateBook);
router.delete("/delete/:id", userMiddleware, deleteBook);

module.exports = router;