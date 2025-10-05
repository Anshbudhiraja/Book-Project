const express = require("express")
const { createUser, loginUser, getUser } = require("../controller/UserController/user.controller")
const { userMiddleware } = require("../middlewares/user.middleware")
const router = express.Router()

router.post("/createUser", createUser)
router.post("/loginUser", loginUser)
router.get("/getUser", userMiddleware, getUser)

module.exports = router