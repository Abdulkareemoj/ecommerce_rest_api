import { create_user_service } from "../services/userServices.js";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

export const create_a_user = asyncHandler(async (req, res) => {
  // Callling the create_user_service function.
  const { newUser, userToken } = await create_user_service(req.body);
  return res
    .status(StatusCodes.CREATED)
    .json({ UserData: { userEmail: newUser.email }, token: userToken });
});
