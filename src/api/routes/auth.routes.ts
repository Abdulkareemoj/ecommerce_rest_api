import express from "express";
import {
  create_a_user,
  LoginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateuserCtrl,
  blockUserCtrl,
  UnBlockUserCtrl,
  handleRefreshToken,
  logoutUserCtrl,
  forgotPassword,
  passwordReset,
  LoginAdmin,
  addToWishList,
  getWishList,
  saveAddress,
  userCartCtrl,
} from "../controllers/userCtrls";
import { auth, isAdmin } from "../middlewares/authMiddleware";

const authRoute = express.Router();

authRoute.post("/signup", create_a_user);
authRoute.post("/login", LoginUser);
authRoute.post("/admin-login", LoginAdmin);
authRoute.get("/allusers", getAllUser);
authRoute.get("/refresh-token", handleRefreshToken);
authRoute.get("/logout", logoutUserCtrl);
authRoute.get("/:id", getUser);
authRoute.delete("/:id", deleteUser);
authRoute.post("/forgotpassword", forgotPassword);
authRoute.patch("/resetpassword/:token", passwordReset);
authRoute.patch("/:id", auth, isAdmin, updateuserCtrl);
authRoute.patch("/block-user/:id", auth, isAdmin, blockUserCtrl);
authRoute.patch("/unblock-user/:id", auth, isAdmin, UnBlockUserCtrl);
authRoute.put("/wishlist", auth, addToWishList);
authRoute.get("/wishlist/:id", auth, getWishList);
authRoute.put("/save-address", auth, saveAddress);
authRoute.post("/cart", auth, userCartCtrl);

export default authRoute;
