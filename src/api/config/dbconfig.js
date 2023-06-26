import mongoose from "mongoose";
import { consoleLogger } from "../utils/componentLogger.js";
import { customErrorLogger } from "../utils/errCustomLogger.js";

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    consoleLogger.info(`Connected to the Database!`);
  } catch (error) {
    customErrorLogger.error(error.message);
  }
};

export default connectDB;
