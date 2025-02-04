import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    price: { type: Number, required: true },
    color: { type: String },
    size: {
      type: String,
      enum: ["sm", "md", "lg", "xl"],
    },
    category: { type: String, required: true },
    images: { type: [String], default: [] },
    inStock: { type: Boolean, default: true },
    totalStock: { type: Number, required: true },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Product",
  ProductSchema
);
