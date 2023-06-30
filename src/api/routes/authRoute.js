import express from "express";
import {
  create_a_user,
  LoginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateuserCtrl,
} from "../controllers/userCtrls.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const authRoute = express.Router();

authRoute.post("/signup", create_a_user);
authRoute.post("/login", LoginUser);
authRoute.get("/allusers", authMiddleware, isAdmin, getAllUser);
authRoute.get("/:id", authMiddleware, isAdmin, getUser);
authRoute.delete("/:id", authMiddleware, isAdmin, deleteUser);
authRoute.patch("/:id", authMiddleware, updateuserCtrl);
authRoute.patch("/block-user/:id", authMiddleware, isAdmin, updateuserCtrl);
authRoute.patch("/unblock-user/:id", authMiddleware, isAdmin, updateuserCtrl);

export default authRoute;
