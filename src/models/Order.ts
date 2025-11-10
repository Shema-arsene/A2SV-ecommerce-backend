import mongoose, { Schema, Document, Types } from "mongoose"

export interface IOrderItem {
  product: Types.ObjectId
  quantity: number
  price: number
}

export interface IOrder extends Document {
  user: Types.ObjectId
  items: IOrderItem[]
  totalPrice: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  description?: string
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IOrder>("Order", orderSchema)
