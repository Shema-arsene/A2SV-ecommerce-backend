import mongoose, { Schema, Document } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  username: string
  email: string
  password: string
  role: "user" | "admin"
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      match: /^[a-zA-Z0-9]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
)

// Password hashing before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model<IUser>("User", userSchema)
