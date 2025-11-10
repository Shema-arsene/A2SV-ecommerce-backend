import mongoose from "mongoose"
import User from "../models/User.js"
import dotenv from "dotenv"

dotenv.config()

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)

    const adminExists = await User.findOne({ email: "admin@ecommerce.com" })

    if (!adminExists) {
      const admin = new User({
        username: "admin",
        email: "admin@ecommerce.com",
        password: "Admin123!", // It will be automatically hashed
        role: "admin",
      })

      await admin.save()
      console.log("Admin user created successfully", admin)
    } else {
      console.log("Admin user already exists")
    }

    await mongoose.disconnect()
  } catch (error) {
    console.error("Error creating admin:", error)
    process.exit(1)
  }
}

createAdmin()
