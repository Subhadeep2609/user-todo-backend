import multerSchema from "../models/multerSchema.js"

export const addPicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded",
            })
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/svg"]
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Invalid file type",
            })
        }

        const imageUrl = `http://localhost:9000/upload/${req.file.filename}`
        // const imageUrl = `${req.file.filename}`

        const data = await multerSchema.create({
            picture: imageUrl
        })

        return res.status(201).json({
            success: true,
            message: "File uploaded successfully",
            data : data,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}