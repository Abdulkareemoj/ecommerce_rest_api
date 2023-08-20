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
  passwordResetCtrl,
} from "../controllers/userCtrls";
import { auth, isAdmin } from "../middlewares/authMiddleware";

const authRoute = express.Router();

authRoute.post("/signup", create_a_user);
authRoute.post("/login", LoginUser);
authRoute.get("/allusers", getAllUser);
authRoute.get("/refresh-token", handleRefreshToken);
authRoute.get("/logout", logoutUserCtrl);
authRoute.get("/:id", getUser);
authRoute.delete("/:id", deleteUser);
authRoute.put("/password-update", auth, passwordResetCtrl);
authRoute.patch("/:id", auth, isAdmin, updateuserCtrl);
authRoute.patch("/block-user/:id", auth, isAdmin, blockUserCtrl);
authRoute.patch("/unblock-user/:id", auth, isAdmin, UnBlockUserCtrl);

export default authRoute;
