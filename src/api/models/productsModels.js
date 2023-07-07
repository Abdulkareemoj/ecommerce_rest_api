import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: false,
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
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
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
    required: true,
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
