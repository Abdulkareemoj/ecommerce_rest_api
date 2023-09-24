import { authModel } from "../models/userModels";
import { UserOrderModel } from "../models/orderModel";
import { productModel } from "../models/productsModels";
import { UserCartModel } from "../models/cartModel";
import { mailer } from "../config/nodeMailer";
import CustomAPIError from "../helpers/custom-errors";
import UnauthenticatedError from "../helpers/unauthenticated";
import { validateMongoDbID } from "../helpers/validateDbId";
import { StatusCodes } from "http-status-codes";
import { generateToken } from "../helpers/jsonWebToken";
import { generateRefreshToken } from "../helpers/refreshToken";
import { UserDataInterface } from "../interfaces/user_interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import { blacklistTokens } from "../models/blacklistTokens";
import crypto from "crypto";
import { IDecoded } from "../interfaces/authenticateRequest";
import { CartItem } from "../interfaces/cartModel_Interface";
import { CartModelInterface } from "../interfaces/cartModel_Interface";
import { ProductDataInterface } from "../interfaces/product_Interface";
import { Types } from "mongoose";

import dotenv from "dotenv";

dotenv.config();

// User signup Services
export const create_user_service = async (userData: UserDataInterface) => {
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
export const login_user_service = async (
  userData: Partial<UserDataInterface>
) => {
  const { email, password } = userData; // Extract Email and Password from userData

  // checking if both fields are omitted
  if (!email || !password) {
    throw new CustomAPIError(
      `Email and Password are required for login.`,
      StatusCodes.BAD_REQUEST
    );
  }
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
      "Password or email didn't match any on our database",
      StatusCodes.NOT_FOUND
    );
  } else {
    //const token = userExists.createJWT();
    const token: string = generateToken(userExists._id);
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

// Login Admin Service
export const login_admin_service = async (
  AdminData: Partial<UserDataInterface>
) => {
  const { email, password } = AdminData; // Extract Email and Password from userData

  // checking if both fields are omitted
  if (!email || !password) {
    throw new CustomAPIError(
      `Email and Password are required for login.`,
      StatusCodes.BAD_REQUEST
    );
  }
  const AdminExists = await authModel.findOne({ email: email });

  if (!AdminExists) {
    throw new UnauthenticatedError(
      "Password or email didn't match any on our database",
      StatusCodes.NOT_FOUND
    );
  }

  // checking fot the role of the Admin
  if (AdminExists.role !== "admin")
    throw new CustomAPIError(
      `The User is not an administrator`,
      StatusCodes.BAD_REQUEST
    );

  // comparing the password of the user.
  const isMatch = await AdminExists.comparePwd(password);
  if (!isMatch) {
    throw new UnauthenticatedError(
      "Password or email didn't match any on our database",
      StatusCodes.NOT_FOUND
    );
  } else {
    //const token = userExists.createJWT();
    const token: string = generateToken(AdminExists._id);
    const refreshToken = generateRefreshToken(AdminExists._id);
    const updateLoggedUser = await authModel.findByIdAndUpdate(
      AdminExists._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    return { AdminExists, token, updateLoggedUser };
  }
};

// get all users service
export const get_all_users_service = async (): Promise<UserDataInterface[]> => {
  const getUsers = await authModel.find();
  if (getUsers.length <= 0) {
    throw new CustomAPIError(`No users found`, StatusCodes.NO_CONTENT);
  }
  return getUsers;
};

// Get a Single user Service
export const get_single_user_service = async (
  userID: string
): Promise<UserDataInterface> => {
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
export const delete_single_user = async (
  userId: Partial<UserDataInterface>
): Promise<UserDataInterface> => {
  const { id } = userId;
  validateMongoDbID(id);
  const user = await authModel.findOneAndDelete({ _id: userId.id });
  console.log(user);
  if (!user)
    throw new CustomAPIError(
      `The user with the ID: ${id} does not exist`,
      StatusCodes.NOT_FOUND
    );
  return user;
};

// Updating the user Service
export const updateUserService = async (
  userId: Partial<UserDataInterface>,
  updateData: UserDataInterface
): Promise<UserDataInterface> => {
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
export const blockUserService = async (
  User: Partial<UserDataInterface>
): Promise<UserDataInterface> => {
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
export const unBlockUserService = async (
  User: Partial<UserDataInterface>
): Promise<UserDataInterface> => {
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
export const handle_refresh_token_service = async (
  cookies: UserDataInterface
) => {
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
    jwt.verify(refreshToken, process.env.JWT_SECRET!, (err, decoded) => {
      const decodeJWT = decoded as IDecoded;
      console.log("decodedData: ", decodeJWT);
      if (err || !decoded || token.id !== decodeJWT.id) {
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
export const LogoutService = async (
  cookies: string
): Promise<UserDataInterface | void> => {
  const refreshToken = cookies;

  if (!refreshToken) {
    throw new CustomAPIError(
      "There is no refresh token in cookies",
      StatusCodes.NOT_FOUND
    );
  }
  const token = await authModel.findOne({ refreshToken });

  if (!token) {
    throw new CustomAPIError(
      "There are no refresh token in cookies",
      StatusCodes.UNAUTHORIZED
    );
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET!, (err, decoded) => {
      const decodeJWT = decoded as IDecoded;
      console.log("decodedData: ", decodeJWT);
      if (err || token.id !== decodeJWT.id) {
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
};

// Forgot password service
export const fgtPwdService = async (
  user_email: string
): Promise<UserDataInterface | void> => {
  try {
    const user = await authModel.findOne({ email: user_email });

    if (!user) {
      throw new CustomAPIError(
        `We could not find a user with the given email ${user_email}`,
        StatusCodes.NOT_ACCEPTABLE
      );
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:4040/api/v1/users/resetPassword/${resetToken}`;
    const message = `We have received a password reset request. 
    Please use the link below to reset your password:\n\n${resetUrl}\n\nThis link expires after 10 minutes.`;
    const subject = "Password reset request received";
    mailer(user_email, subject, message);
  } catch (error) {
    throw new CustomAPIError(
      "Could not reset password",
      StatusCodes.BAD_REQUEST
    );
  }
};

// Reset password service
export const resetPwdService = async (
  token: string,
  newPassword: string,
  confirmPassword: string
): Promise<UserDataInterface | void> => {
  // checking if the user exists with the given token & has not expired.
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await authModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new CustomAPIError(
      "Token is invalid or it has expired!",
      StatusCodes.BAD_REQUEST
    );
  }

  // Resetting the user password
  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = new Date(Date.now());

  await user.save();

  return user;
};

// add to wishlist functionality
export const addToWishListService = async (userID: string, prodID: string) => {
  try {
    const user = await authModel.findById(userID);
    // console.log(user);
    if (!user) {
      // Handle the case where user is not found
      throw new CustomAPIError("User not found", StatusCodes.NOT_FOUND);
    }
    const alreadyAdded = user.wishlists.find((id) => id.toString() === prodID);

    if (alreadyAdded) {
      return await authModel.findByIdAndUpdate(
        userID,
        {
          $pull: { wishlists: prodID },
        },
        {
          new: true,
        }
      );
    } else {
      return await authModel.findByIdAndUpdate(
        userID,
        {
          $push: { wishlists: prodID },
        },
        {
          new: true,
        }
      );
    }
  } catch (err) {
    throw new CustomAPIError(
      "Could not add product to wishlists",
      StatusCodes.BAD_REQUEST
    );
  }
};

export const getWishListService = async (
  userId: string | undefined
): Promise<UserDataInterface> => {
  const finduser = await authModel.findById(userId).populate("wishlists");
  console.log("find User Data: finduser");
  try {
    if (!finduser) {
      throw new CustomAPIError(
        `The User with the ID: ${userId} does not exist`,
        StatusCodes.NOT_FOUND
      );
    }
    console.log("find User Data:", finduser);
    return finduser;
  } catch (error) {
    throw new Error("Could not retrieve wishlist");
  }
};

export const saveAddress_service = async (userID: string, address: string) => {
  validateMongoDbID(userID);
  try {
    const updateUser = await authModel.findByIdAndUpdate(
      userID,
      { address },
      { new: true }
    );
    if (!updateUser) {
      throw new Error(`User with ID ${userID} not found`);
    }
    console.log("user data: ", updateUser);
    return updateUser;
  } catch (error) {
    // console.error("Error while updating user:", error);
    throw new Error("Could not save address");
  }
};


/* export const userCartService = async (
  userId: string,
  cart: CartItem[]
): Promise<CartModelInterface | null | void> => {
  try {
    let OrderedProducts: CartItem[] = [];


    // check if the user already has a cart and remove it
    const alreadyHasCart = await UserCartModel.findOne({ orderby: userId });
    if (alreadyHasCart) {
      console.log("Already has a cart: ", alreadyHasCart);
      alreadyHasCart.remove();
    }

    // iterate through the cart items.
    for (let i = 0; i < cart.length; i++) {
      const { id, count, color } = cart[i];

      // Fetch the product details using the id.
      const getProduct = await productModel.findById(id).select("price");
      console.log("getProduct:", getProduct);
      if (!getProduct) {
        console.error(`Product with ID ${id} not found.`);
        continue;
      } else {
        OrderedProducts.push({
          id: id,
          count,
          color,
          price: getProduct.price,
        });
      }
    }
    let cartTotal: number = 0;

    // calculating the cart total;
    for (let i = 0; i < OrderedProducts.length; i++) {
      cartTotal += OrderedProducts[i].price * OrderedProducts[i].count;
    }
    console.log("OrderedProducts:", OrderedProducts);

    const newCart = await new UserCartModel({
      products: OrderedProducts.map((product) => ({
        product: product.id,
        count: product.count,
        color: product.color,
        price: product.price,
      })),
      cartTotal,
      orderby: userId,
    }).save();

    // console.log("New cart: ", newCart);

    return newCart;
  } catch (error) {
    throw new Error("Could not add Product to cart");
  }
}; */

export const userCartService = async (userId: string, cart: CartItem[]) => {
  let products = [];

  const user = await authModel.findById(userId);

  // checking if the user already has a cart.
  const userAlreadyHascart = await UserCartModel.findOne({
    orderby: user?._id,
  });
  if (userAlreadyHascart) {
    userAlreadyHascart.remove();
  }

  for (let i = 0; i < cart.length; i++) {
    let cartItem: CartItem = {
      id: cart[i].id,
      count: cart[i].count,
      color: cart[i].color,
      price: 0,
    };

    
    const getPrice = await productModel
      .findById(cart[i].id)
      .select("price")
      .exec();
    if (getPrice) {
      cartItem.price = getPrice.price;
    }

    products.push(cartItem);
  }

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  const newCart = await new UserCartModel({
    products,
    cartTotal,
    orderby: user?._id,
  }).save();
  return newCart;
};
