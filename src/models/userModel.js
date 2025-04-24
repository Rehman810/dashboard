import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: false },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    phone: {
      type: String,
      required: false,
    },
    profileImage: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
