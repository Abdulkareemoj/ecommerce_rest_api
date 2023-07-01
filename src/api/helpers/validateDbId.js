import mongoose from "mongoose";
import CustomAPIError from "../helpers/custom-errors.js";
import { StatusCodes } from "http-status-codes";

export const validateMongoDbID = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid)
    throw new CustomAPIError("This ID is not valid", StatusCodes.FORBIDDEN);
};
