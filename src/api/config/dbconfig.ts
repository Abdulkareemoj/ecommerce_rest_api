import mongoose from "mongoose";
import { consoleLogger } from "../utils/componentLogger";
//import { customErrorLogger } from "../utils/errCustomLogger";

const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url);
    consoleLogger.info(`Connected to the Database!`);
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
