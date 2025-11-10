import type { Response } from "express"
import Order from "../models/Order.js"
import type { IOrder } from "../models/Order.js"
import Product from "../models/Product.js"
import type { AuthRequest } from "../middleware/auth.js"
import mongoose from "mongoose"

export const createOrder = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { items, description } = req.body
    const userId = req.user!._id

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      await session.abortTransaction()
      return res.status(400).json({
        success: false,
        message: "Order creation failed",
        errors: ["Order must contain at least one item"],
      })
    }

    let totalPrice = 0
    const orderItems = []

    // Process each item in the order
    for (const item of items) {
      const { productId, quantity } = item

      // Validate quantity
      if (!quantity || quantity < 1) {
        await session.abortTransaction()
        return res.status(400).json({
          success: false,
          message: "Order creation failed",
          errors: [`Invalid quantity for product ${productId}`],
        })
      }

      // Find product with session for transaction
      const product = await Product.findById(productId).session(session)

      if (!product) {
        await session.abortTransaction()
        return res.status(404).json({
          success: false,
          message: "Order creation failed",
          errors: [`Product not found: ${productId}`],
        })
      }

      // Check stock availability
      if (product.stock < quantity) {
        await session.abortTransaction()
        return res.status(400).json({
          success: false,
          message: "Creating order failed",
          errors: [
            `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${quantity}`,
          ],
        })
      }

      // Calculate item total
      const itemTotal = product.price * quantity
      totalPrice += itemTotal

      // Update product stock
      product.stock -= quantity
      await product.save({ session })

      // Add to order items
      orderItems.push({
        product: productId,
        quantity,
        price: product.price,
      })
    }

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalPrice,
      description,
      status: "pending",
    })

    await order.save({ session })
    await session.commitTransaction()

    // Populate product details for response
    const populatedOrder = await Order.findById(order._id)
      .populate("items.product", "name description price category")
      .populate("user", "username email")

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      object: populatedOrder,
      errors: null,
    })
  } catch (error: any) {
    await session.abortTransaction()

    res.status(400).json({
      success: false,
      message: "Order creation failed",
      errors: [error.message],
    })
  } finally {
    session.endSession()
  }
}

export const getOrderHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const totalOrders = await Order.countDocuments({ user: userId })
    const orders = await Order.find({ user: userId })
      .populate("items.product", "name description price category")
      .populate("user", "username email")
      .select("items totalPrice status description createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.json({
      success: true,
      message: "Order history fetched successfully",
      object: orders,
      pageNumber: page,
      pageSize: limit,
      totalSize: totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      errors: null,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch the order history",
      errors: [error.message],
    })
  }
}

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params
    const order = await Order.findById(orderId)
      .populate("items.product", "name description price category")
      .populate("user", "username email")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        errors: ["Order does not exist"],
      })
    }

    // Check if the order belongs to the authenticated user unless the user is admin
    if (
      order.user._id.toString() !== req.user!._id.toString() &&
      req.user!.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
        errors: ["You can only view your own orders"],
      })
    }

    res.json({
      success: true,
      message: "Order retrieved successfully",
      object: order,
      errors: null,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order",
      errors: [error.message],
    })
  }
}
