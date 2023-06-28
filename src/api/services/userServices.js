import { authModel } from "../models/userModels.js";
import { mailer } from "../config/nodeMailer.js";

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
  const { email, password } = userData; // Extract Email and Password fro userData
  const userExists = await authModel.findOne({ email: email });
  if (!userExists) {
    throw new Error("Password or email didn't match any on our database");
  }
  const isMatch = await userExists.comparePwd(password);
  if (!isMatch) {
    throw new Error("Password or email didn't match any on our database");
  }
  const token = userExists.createJWT();
  return { userExists, token };
};

// get all users service
export const get_all_users_service = async (users) => {
  const getUsers = await authModel.find(users);
  return getUsers;
};

// Get a Single user Service
export const get_single_user_service = async (userID) => {
  const { id } = userID; // destructure the user ID from the user
  const userExists = await authModel.findById({ _id: id });
  console.log(userExists);
  if (!userExists) {
    throw new Error(`The User with the ID ${id} does not exist`);
  }
  return userExists;
};

//Delete a single user service
export const delete_single_user = async (userId) => {
  const { id } = userId;
  const user = await authModel.findOneAndDelete({ _id: id });
  console.log(user);
  if (!user) throw new Error("The user was not found.");
  return user;
};

// Updating the user Service
export const updateUserService = async (userId, updateData) => {
  const { id } = userId;
  const updateuser = await authModel.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });
  console.log(userId);
  if (!updateuser) {
    throw new Error("The user was not found to be updated");
  }
  return updateuser;
};
