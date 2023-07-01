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
} from "../controllers/userCtrls.js";
import { auth, isAdmin } from "../middlewares/authMiddleware.js";

const authRoute = express.Router();

authRoute.post("/signup", create_a_user);
authRoute.post("/login", LoginUser);
authRoute.get("/allusers", getAllUser);
authRoute.get("/refresh-token", handleRefreshToken);
authRoute.get("/:id", getUser);
authRoute.delete("/:id", deleteUser);
authRoute.patch("/:id", auth, isAdmin, updateuserCtrl);
authRoute.patch("/block-user/:id", auth, isAdmin, blockUserCtrl);
authRoute.patch("/unblock-user/:id", auth, isAdmin, UnBlockUserCtrl);

export default authRoute;
