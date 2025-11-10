import mongoose from "mongoose"

const Mongo_URI = process.env.MONGODB_URI
const connectDB = async (): Promise<void> => {
  try {
    if (!Mongo_URI) {
      throw new Error("Please add your Mongo URI to .env")
    }
    const connection = await mongoose.connect(Mongo_URI as string, {})

    console.log("MongoDB Connected")
    console.log(
      `Connection State: ${mongoose.STATES[connection.connection.readyState]}`
    )
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message)
  }
}

export default connectDB
