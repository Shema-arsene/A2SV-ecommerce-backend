import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"

// Environment variables
dotenv.config()

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)

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
