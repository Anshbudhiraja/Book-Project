const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const User = require("../model/UserModel/user.model");
require("dotenv").config()
function isValidHexToken(str, bytes) {
  const expectedLength = bytes * 2;
  return typeof str === "string" && /^[a-fA-F0-9]+$/.test(str) && str.length === expectedLength;
}
const userMiddleware = async (req, resp, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader?.startsWith("Bearer ")) return resp.status(401).send({message:"Token is required"})
        
        const token = authHeader.split(" ")[1];
        const { id, rawToken } = jwt.verify(token, process.env.JWT_SECRET);
        if (!id || !mongoose.isValidObjectId(id) || !rawToken || !isValidHexToken(rawToken,8)) return resp.status(401).send({message:"Invalid token"})

        const user = await User.findById(id).select("-password");
        if (!user || !user.tokenVersion) return resp.status(401).send({message:"Unauthorized user"})

        const matched = await bcrypt.compare(rawToken,user.tokenVersion)
        if(!matched) return resp.status(401).send({message:"Unauthorized user"})

        req.user = user;
        next();
    } catch (error) {
        return resp.status(401).send({message:"Invalid or expired token"})
    }
}

module.exports={userMiddleware}