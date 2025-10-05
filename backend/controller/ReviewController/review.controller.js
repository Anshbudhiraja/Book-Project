const Book = require("../../model/BookModel/book.model");
const Review = require("../../model/ReviewModel/ReviewModel");
const mongoose = require("mongoose")
const addReview = async (req, resp) => {
  const { bookId } = req.params;
  const { rating, text } = req.body;

  try {
    if(!bookId || !mongoose.isValidObjectId(bookId)) return resp.status(400).send({message:"Invalid Book id"})
    if(!rating) return resp.status(400).send({message:"Rating is required"})
    if(!text) return resp.status(400).send({message:"Rating text is required"}) 
    if(typeof rating !== "number" || !Number(rating) || ![1,2,3,4,5].includes(Number(rating))) return resp.status(400).send({message:"Invalid Rating"})
      
    const book = await Book.findById(bookId);
    if (!book) return resp.status(404).json({ message: "Book not found" });

    const newReview = new Review({book: bookId,user: req.user._id,rating,text});
    await newReview.save()
    return resp.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    return resp.status(500).json({ message: "Server error", error: err.message });
  }
}
const updateReview =  async (req, resp) => {
  const { reviewId } = req.params;
  const { rating, text } = req.body;

  try {
    if(!reviewId || !mongoose.isValidObjectId(reviewId)) return resp.status(400).send({message:"Invalid Review id"})
    if(!rating) return resp.status(400).send({message:"Rating is required"})
    if(!text) return resp.status(400).send({message:"Rating text is required"}) 
    if(typeof rating !== "number" || !Number(rating) || ![1,2,3,4,5].includes(Number(rating))) return resp.status(400).send({message:"Invalid Rating"})
    
    const review = await Review.findById(reviewId);
    if (!review) return resp.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) return resp.status(403).json({ message: "Unauthorized" });

    review.rating = rating;
    review.text = text;
    await review.save();

    resp.status(200).json({ message: "Review updated successfully" });
  } catch (err) {
    resp.status(500).json({ message: "Server error", error: err.message });
  }
}
const deleteReview = async (req, resp) => {
  const { reviewId } = req.params;

  try {
    if(!reviewId || !mongoose.isValidObjectId(reviewId)) return resp.status(400).send({message:"Invalid Review id"})

    const review = await Review.findById(reviewId);
    if (!review) return resp.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) return resp.status(403).json({ message: "Unauthorized" });

    await review.deleteOne();

    return resp.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    return resp.status(500).json({ message: "Server error", error: err.message });
  }
}
const getAllReviews = async (req, resp) => {
  const { bookId } = req.params;
  try {
    if(!bookId || !mongoose.isValidObjectId(bookId)) return resp.status(400).send({message:"Invalid Book id"})
    const reviews = await Review.find({ book: bookId }).populate("user", "name email");
    return resp.status(200).json({message:"Reviews fetched",reviews });
  } catch (err) {
    resp.status(500).json({ message: "Server error", error: err.message });
  }
}
module.exports = {addReview, updateReview, deleteReview, getAllReviews}