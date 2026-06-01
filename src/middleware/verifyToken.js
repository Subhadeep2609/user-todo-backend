import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userSchema from "../models/userSchema.js";

export  const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Token authorization invalid or not found"
            })
        } else {
            const token = authHeader.split(" ")[1];
            console.log("token :", token)
            jwt.verify(token, process.env.SECRET_KEY, async(err, decoded) => {
                console.log("decoded", decoded)
                if (err) {
                    if (err.message === "ExpiredTokenError") {
                        return res.status(401).json({
                            success: false,
                            message: "Expired Token"
                        })
                    }
                    return res.status(401).json({
                        success: false,
                        message: "Invalid token"
                    })
                } else {
                    const { id } = decoded;
                    const user = await userSchema.findById(id);
                    if (!user) {
                        return res.status(401).json({
                            success: false,
                            message: "user not found"
                        })
                    } else {
                        user.token = null;
                        user.isVerified = true;
                        await user.save();
                        return res.status(200).json({
                            success: true,
                            message: "User verified successfully"
                        })
                    }
                }
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}