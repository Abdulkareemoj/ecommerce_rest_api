import CustomAPIError from "../helpers/custom-errors";
import { Request, Response, NextFunction, } from "express";
const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  console.log(err);
  return res.status(500).json({ msg: err.message });
};

export default errorHandlerMiddleware;
