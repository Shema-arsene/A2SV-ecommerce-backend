import type { Request, Response } from "express"
import User from "../models/User.js"
import generateToken from "../utils/generateToken.js"

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body

    //   Validation: check if missing fields
    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required!" })
      return
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Registration failed",
        errors: ["Email or username already exists"],
      })
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Registration failed",
        errors: [
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        ],
      })
    }

    const user = new User({ username, email, password, role: role || "user" })
    await user.save()

    const token = generateToken(user._id.toString())

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      object: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
      errors: null,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Registration failed",
      errors: [error.message],
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password")

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Login failed",
        errors: ["Invalid login credentials"],
      })
    }

    const token = generateToken(user._id.toString())

    res.json({
      success: true,
      message: "Login successful",
      object: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
      errors: null,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Login failed",
      errors: [error.message],
    })
  }
}
