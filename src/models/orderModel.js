import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Order",
  OrderSchema
);
