import express from "express";
import {
  create_a_user,
  LoginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateuserCtrl,
} from "../controllers/userCtrls.js";

const authRoute = express.Router();

authRoute.post("/signup", create_a_user);
authRoute.post("/login", LoginUser);
authRoute.get("/allusers", getAllUser);
authRoute.get("/:id", getUser);
authRoute.delete("/:id", deleteUser);
authRoute.patch("/:id", updateuserCtrl);

export default authRoute;
