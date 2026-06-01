import todoSchema from "../models/todoSchema.js";
import userSchema from "../models/userSchema.js";


export const createTodo = async (req, res) => {
    try {
        const { title } = req.body;
        const newTodo = await todoSchema.create({ title, userId: req.userId });
        return res.status(200).json({
            success: true,
            message: "Todo created successfully",
            data: newTodo
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Todo not created"
        })
    }
}
export const getAllTodo = async (req, res) => {
    try {
        const getTodos = await todoSchema.find({ userId: req.userId });
        return res.status(200).json({
            success: true,
            message: "Todo fetched successfully",
            data: getTodos
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Todo not fetched",
        })
    }
}

export const deleteTodo = async (req, res) => {
    try {
        const todoId = req.params.id;
        const user = await userSchema.findById({ _id: req.userId })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            const todo = await todoSchema.findOneAndDelete({ _id: todoId, userId: user._id });
            if (!todo) {
                return res.status(404).json({
                    success: false,
                    message: "Todo not found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Todo deleted successfully",
                data: todo
            })
        }


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const updateTodo = async (req, res) => {
    try {
        const title = req.body.title;
        const todoId = req.params.id;
        const user = await userSchema.findById({ _id: req.userId })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            const newTodo = await todoSchema.findOneAndUpdate({_id:todoId,userId:user._id}, {title}, { new: true });
            if (!newTodo) {
                return res.status(404).json({
                    success: false,
                    message: "Todo not found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Todo updated successfully",
                data: newTodo
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//paginated todos
export const paginateTodo = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 3; // 3 todos per page

    // Calculating the skip value
    const skip = (page - 1) * limit;

    // Getting todo with pagination
    const todo = await todoSchema
      .find({ userId: req.userId })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Todos fetched as per query",
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
