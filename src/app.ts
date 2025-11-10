import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"

// Environment variables
dotenv.config()

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Middleware to catch errors
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: [
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
      ],
    })
  }
)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})

export default app
