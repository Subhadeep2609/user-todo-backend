import userSchema from "../models/userSchema.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv/config";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../verifyEmail/verifyEmail.js";
import sessionSchema from "../models/sessionSchema.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingEmail = await userSchema.findOne({ email });
        if (existingEmail) {
            return res.status(401).json({
                success: false,
                message: "User already exists"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await userSchema.create({ name, email, password: hashPassword });
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: "5m"
        })
        console.log("token :", token);
        user.token = token;
        await user.save()
        verifyEmail(token, email)
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User not created"
        })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        } else {
            const matchedPassword = await bcrypt.compare(password, user.password);
            console.log(matchedPassword)
            if (matchedPassword && user.isVerified === true) {
                await sessionSchema.findOneAndDelete({userId:user._id})
                await sessionSchema.create({userId:user._id})

                const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
                    expiresIn: "10days"
                })
                const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
                    expiresIn: "30days"
                })
                user.isLoggedIn = true;
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "User logged in successfully",
                    data: user,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                })
            } else if (!matchedPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid credentials"
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Please verify first then try to login"
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const logout = async (req, res) => {

    try {
        const existing = await sessionSchema.findOne({ userId: req.userId });
        const user = await userSchema.findById({ _id: req.userId });    
        if (existing) {
            await sessionSchema.findOneAndDelete({ userId: req.userId });
            user.isLoggedIn = false;
            await user.save()
            return res.status(200).json({
                success: true,
                message: "Session successfully ended",
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "User had no session",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};