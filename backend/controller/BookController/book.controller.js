const Book = require("../../model/BookModel/book.model");
const mongoose = require("mongoose");
const Review = require("../../model/ReviewModel/ReviewModel");
const addBook = async (req, resp) => {
  try {
    const { title, author, description, genre, publishedYear } = req.body;
    if (!title || !author || !description || !genre || !publishedYear) return resp.status(400).send({ message: "All fields are required" })

    const newBook = new Book({
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      genre: genre.trim(),
      publishedYear,
      createdBy: req.user._id,
    });

    await newBook.save();
    return resp.status(201).send({ message: "Book added successfully" });
  } catch (error) {
    return resp.status(500).send({ message: "Internal Server Error", error });
  }
};
const getBooks = async (req, resp) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const totalBooks = await Book.countDocuments({createdBy:req.user._id});
    const books = await Book.find({createdBy:req.user._id}).populate("createdBy", "name email").skip(skip).limit(limit).sort({ createdAt: -1 });

    return resp.status(200).send({message: "Books fetched successfully",page,totalPages: Math.ceil(totalBooks / limit),totalBooks,data: books,});
  } catch (error) {
    return resp.status(500).send({ message: "Internal Server Error", error });
  }
};
const getBook = async (req, resp) => {
  try {
    const {bookId} = req.params
    if(!bookId || !mongoose.isValidObjectId(bookId)) return resp.status(400).send({message:"Invalid Book Id"})

    const existingBook = await Book.findById(bookId).populate("createdBy", "name email")
    if(!existingBook) return resp.status(400).send({message:"Book not found"})

    const reviews = await Review.find({ book:bookId });
    let avgRating = 0;
    if (reviews.length > 0) {
      const total = reviews.reduce((acc, r) => acc + r.rating, 0);
      avgRating = total / reviews.length;
    }
    return resp.status(200).send({message: "Book fetched successfully",data:existingBook,avgRating});
  } catch (error) {
    return resp.status(500).send({ message: "Internal Server Error", error });
  }
};
const updateBook = async (req, resp) => {
  try {
    const { id } = req.params;
    if(!id || !mongoose.isValidObjectId(id)) return resp.status(400).send({message:"Invalid Book Id"})

    const { title, author, description, genre, publishedYear } = req.body;

    const book = await Book.findById(id);
    if (!book) return resp.status(404).send({ message: "Book not found" });

    if (book.createdBy.toString() !== req.user._id.toString()) {
      return resp.status(403).send({ message: "You are not authorized to edit this book" });
    }

    await Book.findByIdAndUpdate(id,{ title, author, description, genre, publishedYear },{ new: true, runValidators: true });

    return resp.status(200).send({ message: "Book updated successfully" });
  } catch (error) {
    return resp.status(500).send({ message: "Internal Server Error", error });
  }
};
const deleteBook = async (req, resp) => {
  try {
    const { id } = req.params;
    if(!id || !mongoose.isValidObjectId(id)) return resp.status(400).send({message:"Invalid Book Id"})

    const book = await Book.findById(id);
    if (!book) return resp.status(404).send({ message: "Book not found" });

    if (book.createdBy.toString() !== req.user._id.toString()) {
      return resp.status(403).send({ message: "You are not authorized to delete this book" });
    }

    await book.deleteOne();
    return resp.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    return resp.status(500).send({ message: "Internal Server Error", error });
  }
};
const getAllBooks = async (req, resp) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const totalBooks = await Book.countDocuments();
    const books = await Book.find().populate("createdBy", "name email").skip(skip).limit(limit).sort({ createdAt: -1 });

    return resp.status(200).send({message: "Books fetched successfully",page,totalPages: Math.ceil(totalBooks / limit),totalBooks,data: books,});
  } catch (error) {
    return resp.status(500).send({ message: "Internal Server Error", error });
  }
};
module.exports = { addBook, getBooks, updateBook, deleteBook, getAllBooks,getBook };