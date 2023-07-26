import { Request, Response, NextFunction } from "express";

const __404_err_page = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Error Page: Resource cannot be found!");
};

export default __404_err_page;
