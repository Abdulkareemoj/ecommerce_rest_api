import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const __404_err_page = (req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).send("Error Page: Resource cannot be found!");
};

export default __404_err_page;
