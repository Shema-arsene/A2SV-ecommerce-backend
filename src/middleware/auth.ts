import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import type { IUser } from "../models/User.js"

export interface AuthRequest extends Request {
  user?: IUser
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
      errors: ["Authentication required"],
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or user does not exist",
        errors: ["Authentication failed"],
      })
    }

    req.user = user
    next()
  } catch (error: unknown) {
    res
      .status(401)
      .json({
        message: "Not authorized, token failed",
        error: (error as Error).message,
      })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
        errors: ["Insufficient permissions"],
      })
    }
    next()
  }
}
