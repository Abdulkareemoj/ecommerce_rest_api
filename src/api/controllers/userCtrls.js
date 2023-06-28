import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import {
  create_user_service,
  login_user_service,
  get_all_users_service,
  get_single_user_service,
  delete_single_user,
  updateUserService,
} from "../services/userServices.js";

// User Signup controller
export const create_a_user = asyncHandler(async (req, res) => {
  // Callling the create_user_service function.
  const { newUser, userToken } = await create_user_service(req.body);
  return res
    .status(StatusCodes.CREATED)
    .json({ UserData: { userEmail: newUser.email }, token: userToken });
});

// User Login Controller
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

// Get all users Controller
export const getAllUser = asyncHandler(async (req, res) => {
  const users = await get_all_users_service();
  if (users.length <= 0) {
    return res
      .status(StatusCodes.NO_CONTENT)
      .json({ message: "No Users Avaliable" });
  }
  return res
    .status(StatusCodes.OK)
    .json({ numberOfUsers: users.length, users });
});

//Get a single user controller
export const getUser = asyncHandler(async (req, res) => {
  // Destructuring the _id field from the req.params
  const { id } = req.params;

  const userDataID = await get_single_user_service({ id });

  return res.status(StatusCodes.OK).json({ userDataID });
});

// Deleting a single user controller
export const deleteUser = asyncHandler(async (req, res) => {
  // Destructuring the ID field for req.params
  const { id } = req.params;
  const userDataId = await delete_single_user({ id });
  return res.status(StatusCodes.OK).json({ userDataId });
});

// Updating the user controller
export const updateuserCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const updatedUser = await updateUserService({ id }, req.body);
  return res.status(StatusCodes.OK).json({ status: "successful", updatedUser });
});
