import mongoose from "mongoose";
import CustomAPIError from "./custom-errors";
import { StatusCodes } from "http-status-codes";

export const validateMongoDbID = (id: string) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid)
    throw new CustomAPIError("This ID is not valid", StatusCodes.FORBIDDEN);
};
