import mongoose from "mongoose";
import dotenv from "dotenv/config";

const url = process.env.URL;

async function dbConnect(){
    try{
        await mongoose.connect(url);
        console.log("MongoDB connected")
    }catch(error){
        console.log("MongoDB not connected",error)
    }
}

export default dbConnect;