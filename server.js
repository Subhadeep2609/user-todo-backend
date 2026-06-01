import express from "express";
import dotenv from "dotenv/config"
import dbConnect from "./src/config/dbConnect.js";
import userRoute from "./src/routes/userRoute.js";
import todoRoute from "./src/routes/todoRoute.js";

const port = process.env.PORT;

const app = express();

app.use(express.json())
app.use("/user",userRoute);
app.use("/todo",todoRoute)
dbConnect()

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})