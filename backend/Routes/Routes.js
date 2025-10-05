const express = require("express");
const auth_routes = require("./auth.routes")
const bookRoutes = require("./book.routes");
const reviewRoutes = require("./review.routes");
const router = express.Router();

router.use("/auth", auth_routes)
router.use("/books", bookRoutes);
router.use("/reviews", reviewRoutes);

module.exports = router;