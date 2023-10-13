import CustomAPIError from "../helpers/custom-errors";
import { Request, Response } from "express";
const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  console.log(err);
  return res.status(500).json({ msg: err.message });
};

export default errorHandlerMiddleware;
