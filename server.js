import express from "express";
import dotenv from "dotenv/config"
import dbConnect from "./src/config/dbConnect.js";
import userRoute from "./src/routes/userRoute.js";
import todoRoute from "./src/routes/todoRoute.js";
import multerRoute from "./src/routes/multerRoute.js";

const port = process.env.PORT;

const app = express();

app.use(express.json())
app.use("/upload", express.static("upload"))
app.use("/user",userRoute);
app.use("/todo",todoRoute);
app.use("/pic",multerRoute)

dbConnect()

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})