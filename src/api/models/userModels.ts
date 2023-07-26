import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import { consoleLogger } from "../utils/componentLogger.js";
import { UserDataInterface } from "../interfaces/user_interface";

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please your First name is mandatory."],
      unique: false,
    },
    lastName: {
      type: String,
      required: [true, "Please your Last name is mandatory."],
      unique: false,
    },
    email: {
      type: String,
      required: [true, "Please an email address is mandatory."],
      unique: [true, "This email address is currently in use"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Please your mobile number mandatory."],
      unique: [true, "This mobile number is currently in use"],
    },
    password: {
      type: String,
      required: true,
      maxLength: 15,
    },
    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: Array,
      default: [],
    },
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    whishlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// <----- Applying mongoose middleware to the user model----->

// for the moment user registers
// the password is ran through a bcrypt function

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// generate token
userSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.username,
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXP }
  );
};

userSchema.methods.comparePwd = async function (pwd: string) {
  const comparePwd = await bcrypt.compare(pwd, this.password);
  console.info(comparePwd);
  return comparePwd;
};

//Export the model
export const authModel = mongoose.model("Usermodel", userSchema);
