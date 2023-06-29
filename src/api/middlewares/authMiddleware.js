import { authModel } from "../models/userModels.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UnauthenticatedError from "../helpers/unauthenticated.js";

// creating the authentication middleware to authenticate the user.
export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const user = await authModel.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new UnauthenticatedError(
        "Not Athorized token expired, Please Login again.",
        StatusCodes.UNAUTHORIZED
      );
    }
  } else {
    throw new UnauthenticatedError(
      "There is no token atached to the Header.",
      StatusCodes.UNAUTHORIZED
    );
  }
  //   next();
});

// Creating the middleware to handle the admin authorization and authentication
export const isAdmin = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const { email } = req.user;
  const adminUser = await authModel.findOne({ email });
  if (adminUser.role !== "admin")
    throw new UnauthenticatedError(
      "You are not an an administrator",
      StatusCodes.UNAUTHORIZED
    );
  else next();
});
