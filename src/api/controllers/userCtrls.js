import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { generateRefreshToken } from "../helpers/refreshToken.js";
import { authModel } from "../models/userModels.js";
import {
  create_user_service,
  login_user_service,
  get_all_users_service,
  get_single_user_service,
  delete_single_user,
  updateUserService,
  blockUserService,
  unBlockUserService,
  handle_refresh_token_service,
  LogoutService,
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
  const { userExists, token, updateLoggedUser } = await login_user_service({
    email,
    password,
  });

  // checking if the user with the email exists or not.
  if (!userExists) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errMessage: `The user with the email: ${email} is not registered`,
    });
  }
  const refreshToken = generateRefreshToken(userExists._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });
  return res.status(StatusCodes.OK).json({
    userData: { userEmail: email },
    Token: token,
    refToken: updateLoggedUser.refreshToken,
  });
});

// Get all users Controller
export const getAllUser = asyncHandler(async (req, res) => {
  const users = await get_all_users_service();
  //console.log(users);
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
  // console.log(req.user);
  const { id } = req.params;
  // console.log(id);
  const updatedUser = await updateUserService({ id }, req.body);
  return res
    .status(StatusCodes.OK)
    .json({ status: "successfully Updated User", updatedUser });
});

// Block User controller
export const blockUserCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const blockedUser = await blockUserService({ id }, req.body);
  return res.status(StatusCodes.OK).json({
    status: "User blocked Successfully",
    userData: { userBlocked: blockedUser.isBlocked },
  });
});

// Unblock User
export const UnBlockUserCtrl = asyncHandler(async (req, res) => {
  // console.log(req.user);
  const { id } = req.params;
  // console.log(id);
  const unblockedUser = await unBlockUserService({ id }, req.body);
  return res.status(StatusCodes.OK).json({
    status: `User Un-Blocked Successfully`,
    userData: { userBlocked: unblockedUser.isBlocked },
  });
});

// Handle refresh Token controller
export const handleRefreshToken = asyncHandler(async (req, res) => {
  const { cookies } = req;
  const accessTokens = await handle_refresh_token_service(cookies);
  console.log(accessTokens);
  res.status(StatusCodes.OK).json({ A_T: accessTokens });
});

// Log out controller functionality
export const logoutUserCtrl = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const result = await LogoutService(refreshToken);
  if (!result) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(200); // success
});

/**
 * const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

 */