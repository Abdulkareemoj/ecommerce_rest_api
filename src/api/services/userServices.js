import { authModel } from "../models/userModels.js";
import { mailer } from "../config/nodeMailer.js";
import CustomAPIError from "../helpers/custom-errors.js";
import UnauthenticatedError from "../helpers/unauthenticated.js";
import { validateMongoDbID } from "../helpers/validateDbId.js";
import { StatusCodes } from "http-status-codes";
import { generateToken } from "../helpers/jsonWebToken.js";
import { generateRefreshToken } from "../helpers/refreshToken.js";
import jwt from "jsonwebtoken";

// User signup Services
export const create_user_service = async (userData) => {
  const newUser = await authModel.create({ ...userData });
  const userToken = newUser.createJWT();

  // Send a welcome
  const { email } = newUser;
  const subject = "Welcome to Online Shopping Mall";
  const text = "This is an online shopping mall shop with ease";

  mailer(email, subject, text);
  return { newUser, userToken };
};

// Login User service
export const login_user_service = async (userData) => {
  const { email, password } = userData; // Extract Email and Password from userData
  const userExists = await authModel.findOne({ email: email });
  if (!userExists) {
    throw new UnauthenticatedError(
      "Password or email didn't match any on our database",
      StatusCodes.NOT_FOUND
    );
  }
  // comparing the password of the user.
  const isMatch = await userExists.comparePwd(password);
  if (!isMatch) {
    throw new UnauthenticatedError(
      "Password or email didn't match any on our database"
    );
  } else {
    //const token = userExists.createJWT();
    const token = generateToken(userExists._id);
    const refreshToken = generateRefreshToken(userExists._id);
    const updateLoggedUser = await authModel.findByIdAndUpdate(
      userExists._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    return { userExists, token, updateLoggedUser };
  }
};

// get all users service
export const get_all_users_service = async (users) => {
  const getUsers = await authModel.find(users);
  if (getUsers.length <= 0) {
    throw new CustomAPIError(`No users found`, StatusCodes.NO_CONTENT);
  }
  return getUsers;
};

// Get a Single user Service
export const get_single_user_service = async (userID) => {
  const id = userID; // destructure the user ID from the user
  validateMongoDbID(id);
  const userExists = await authModel.findById({ _id: id });
  console.log(userExists);
  if (!userExists) {
    throw new CustomAPIError(
      `The User with the ID: ${id} does not exist`,
      StatusCodes.NOT_FOUND
    );
  }
  return userExists;
};

//Delete a single user service
export const delete_single_user = async (userId) => {
  const { id } = userId;
  validateMongoDbID(id);
  const user = await authModel.findOneAndDelete({ _id: id });
  console.log(user);
  if (!user)
    throw new CustomAPIError(
      `The user with the ID: ${id} does not exist`,
      StatusCodes.NOT_FOUND
    );
  return user;
};

// Updating the user Service
export const updateUserService = async (userId, updateData) => {
  const { id } = userId;
  validateMongoDbID(id);
  const updateuser = await authModel.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });
  console.log(userId);
  if (!updateuser) {
    throw new CustomAPIError(
      `The user with the id: ${id} was not found to be updated`,
      StatusCodes.NOT_FOUND
    );
  }
  return updateuser;
};

// blocking a user service
export const blockUserService = async (User) => {
  const { id } = User;
  validateMongoDbID(id);
  const blockUser = await authModel.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  );
  if (!blockUser) {
    throw new UnauthenticatedError(
      "The User is not avauilable on our database",
      StatusCodes.NO_CONTENT
    );
  } else {
    return blockUser;
  }
};

// unblocking a user
export const unBlockUserService = async (User) => {
  const { id } = User;
  validateMongoDbID(id);
  const unblockuser = await authModel.findByIdAndUpdate(
    id,
    { isBlocked: false },
    {
      new: true,
    }
  );
  if (!unblockuser)
    throw new UnauthenticatedError(
      "The User is not avauilable on our database",
      StatusCodes.NO_CONTENT
    );
  return unblockuser;
};

// handle refresh Token service
export const handle_refresh_token_service = async (cookies) => {
  const refreshToken = cookies.refreshToken;
  if (!refreshToken) {
    throw new CustomAPIError(
      "There is no refresh token in cookies",
      StatusCodes.NOT_FOUND
    );
  }
  const token = await authModel.findOne({ refreshToken });
  if (!token)
    throw new CustomAPIError(
      "There are no refresh Tokens in cookies",
      StatusCodes.UNAUTHORIZED
    );
  let accessToken;
  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      console.log("decodedData: ", decoded);
      if (err || token.id !== decoded.id) {
        throw new CustomAPIError(
          "There is something wrong with the refresh token",
          StatusCodes.NOT_ACCEPTABLE
        );
      }
      accessToken = generateToken(token.id);
    });
  } catch (error) {
    throw new CustomAPIError(
      "Error verifying refresh token",
      StatusCodes.UNAUTHORIZED
    );
  }
  return accessToken;
};

// Logout Service functionality
export const LogoutService = async (cookies) => {
  const refreshToken = cookies;
  if (!refreshToken) {
    throw new CustomAPIError(
      "There is no refresh token in cookies",
      StatusCodes.NOT_FOUND
    );
    const token = await authModel.findOne({ refreshToken });

    if (!token) {
      throw new CustomAPIError(
        "There are no refresh token in cookies",
        StatusCodes.UNAUTHORIZED
      );
    }

    try {
      jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        console.log("decodedData: ", decoded);
        if (err || token.id !== decoded.id) {
          throw new CustomAPIError(
            "There is something wrong with the refresh token",
            StatusCodes.NOT_ACCEPTABLE
          );
        }
        // Assuming you have a blacklistTokens model
        blacklistTokens.create({ token: refreshToken });
      });
    } catch (error) {
      throw new CustomAPIError(
        "Error verifying refresh token",
        StatusCodes.UNAUTHORIZED
      );
    }
  }
};
