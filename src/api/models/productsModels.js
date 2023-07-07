import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  brand: {
    type: String,
    required: true,
    enum: ["Apple", "Microsoft", "Samsung", "Lenovo"],
  },
  sold: {
    type: Number,
    default: 0,
  },
  quantity: { type: Number, required: true },
  images: {
    type: Array,
  },
  color: {
    type: String,
    enum: ["Black", "Brown", "Red"],
  },
  ratings: [
    {
      start: Number,
      postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    },
    { timestamps: true },
  ],
});

export const productModel = mongoose.model("ProductModel", productSchema);
