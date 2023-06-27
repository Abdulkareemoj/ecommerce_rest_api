import express from "express";
import {
  create_a_user,
  LoginUser,
  getAllUser,
} from "../controllers/userCtrls.js";

const authRoute = express.Router();

authRoute.post("/signup", create_a_user);
authRoute.post("/login", LoginUser);
authRoute.get("/allusers", getAllUser);

export default authRoute;
