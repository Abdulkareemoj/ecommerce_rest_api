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
