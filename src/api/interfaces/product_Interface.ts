import { Document, Types } from "mongoose";

// Defining the interface for the rating object
interface Rating {
  start: number;
  postedBy: Types.ObjectId;
}

export interface ProductDataInterface extends Document {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  sold: number;
  quantity: number;
  images: string[];
  color: string;
  ratings: Rating[]; // Ratings array with the Rating interface
  createdAt: Date;
  updatedAt: Date;
}
