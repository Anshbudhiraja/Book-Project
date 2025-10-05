const mongoose = require("mongoose")
require("dotenv").config()
const disposableDomains = require("disposable-email-domains");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const User = require("../../model/UserModel/user.model");

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
const createUser = async(req,resp) => {
    try {
        const {name,email,password} = req.body

        if(!name || !email || !password) return resp.status(400).send({message:"Field are required"})

        if (typeof name !== "string" || name.trim().length < 2) return resp.status(400).send({ message: "Name must be at least 2 characters long" });
        if (!/^[A-Za-z]+$/.test(name.trim())) return resp.status(400).send({ message: "Name should only contain letters" });

        if (typeof email !== "string") return resp.status(400).send({ message: "Email must be a string" });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) return resp.status(400).send({ message: "Invalid email format" });

        const domain = email.split("@")[1].toLowerCase();
        if (disposableDomains.includes(domain))  return resp.status(400).send({ message: "Disposable/temporary emails are not allowed" });

        if (password.length < 6) return resp.status(400).send({ message: "Password must be at least 6 characters long" });

        const updatedEmail = email.trim().toLowerCase()
        const updatedName = capitalize(name.trim())
        const salt = await bcrypt.genSalt(10)
        const updatedPassword = await bcrypt.hash(password,salt)

        const rawToken = crypto.randomBytes(8).toString('hex')
        const hashedToken = await bcrypt.hash(rawToken,salt)

        const existingUser = await User.findOne({email:updatedEmail}).select("-password -tokenVersion -_id")
        if(existingUser) return resp.status(400).send({message:"User already exists with this email"})
        
        const newUser = new User({name:updatedName,email:updatedEmail,password:updatedPassword,tokenVersion:hashedToken})
        await newUser.save()

        const payload = {id:newUser._id,rawToken}
        const token = jwt.sign(payload,process.env.JWT_SECRET)
        return resp.status(201).send({message:"User created successfully!",token:`Bearer ${token}`})
    } catch (error) {
        return resp.status(500).send({message:"Internal Server Error",error})
    }
}
const loginUser = async(req,resp) => {
    try {
        const {email,password} = req.body
        if (!email || !password) return resp.status(400).send({message:"Field are required"})
        if (typeof email !== "string") return resp.status(400).send({ message: "Email must be a string" });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) return resp.status(400).send({ message: "Invalid email format" });

        const domain = email.split("@")[1].toLowerCase();
        if (disposableDomains.includes(domain))  return resp.status(400).send({ message: "Disposable/temporary emails are not allowed" });

        if (password.length < 6) return resp.status(400).send({ message: "Password must be at least 6 characters long" });

        const updatedEmail = email.trim().toLowerCase()

        const existingUser = await User.findOne({email:updatedEmail})
        if(!existingUser) return resp.status(400).send({message:"Invalid Credentials"})

        const matched = await bcrypt.compare(password,existingUser.password)
        if(!matched) return resp.status(400).send({message:"Invalid Credentials"})
        
        const salt = await bcrypt.genSalt(10)
        const rawToken = crypto.randomBytes(8).toString('hex')
        const hashedToken = await bcrypt.hash(rawToken,salt)
        existingUser.tokenVersion = hashedToken
        await existingUser.save()
        
        const payload = {id:existingUser._id,rawToken}
        const token = jwt.sign(payload,process.env.JWT_SECRET)
        return resp.status(202).send({message:"Login Successfully!",token:`Bearer ${token}`})
    } catch (error) {
        return resp.status(500).send({message:"Internal Server Error"})
    }
}
const getUser = async(req,resp) => {
    try {
        const {name,email} = req.user
        return resp.status(202).send({message:"User fetched",data:{name,email}})
    } catch (error) {
        return resp.status(500).send({message:"Internal Server Error"})
    }
}
module.exports = { createUser, loginUser, getUser }