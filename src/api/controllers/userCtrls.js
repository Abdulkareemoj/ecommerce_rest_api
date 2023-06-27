import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import {
  create_user_service,
  login_user_service,
} from "../services/userServices.js";

export const create_a_user = asyncHandler(async (req, res) => {
  // Callling the create_user_service function.
  const { newUser, userToken } = await create_user_service(req.body);
  return res
    .status(StatusCodes.CREATED)
    .json({ UserData: { userEmail: newUser.email }, token: userToken });
});

export const LoginUser = asyncHandler(async (req, res) => {
  // destructuring the email and Password field and setting it in the login_user_service
  const { email, password } = req.body;

  // checking if both fields are omitted
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errMessage: `All Fields Are Mandatory` });
  }

  // Pass email and password separately to login_user_service
  const { userExists, token } = await login_user_service({ email, password });

  // checking if the user with the email exists or not.
  if (!userExists) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errMessage: `The user with the email: ${email} is not registered`,
    });
  }
  return res.status(StatusCodes.OK).json({
    userData: { userEmail: email },
    Token: token,
  });
});
