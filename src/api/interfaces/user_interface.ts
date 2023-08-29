import { Document, Types } from "mongoose";

export interface UserDataInterface extends Document {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
  role: string;
  isBlocked: boolean;
  cart: Types.ObjectId[];
  address: Types.ObjectId[];
  whishlists: Types.ObjectId[];
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  createJWT: () => string;
  comparePwd: (pwd: string) => Promise<boolean>;
  createPasswordResetToken: () => string;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
}
