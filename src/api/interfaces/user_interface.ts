import { Document, Types } from "mongoose";

export interface UserDataInterface extends Document {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
  role: string;
  isBlocked: boolean;
  cart: string[];
  address: Types.ObjectId[]; // Assuming Address model uses Types.ObjectId as well
  whishlists: Types.ObjectId[]; // Assuming Product model uses Types.ObjectId as well
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}