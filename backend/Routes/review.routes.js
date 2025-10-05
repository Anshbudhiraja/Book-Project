const express = require("express")
const { userMiddleware } = require("../middlewares/user.middleware")
const { addReview, updateReview, deleteReview, getAllReviews } = require("../controller/ReviewController/review.controller")
const router = express.Router()

router.post("/addReview/:bookId", userMiddleware,addReview)
router.put("/updateReview/:reviewId", userMiddleware,updateReview)
router.delete("/deleteReview/:reviewId", userMiddleware,deleteReview)
router.get("/:bookId",userMiddleware, getAllReviews)

module.exports = router