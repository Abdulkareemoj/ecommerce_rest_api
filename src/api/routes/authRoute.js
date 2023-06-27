import express from "express";
import {
  create_a_user,
  LoginUser,
  getAllUser,
  getUser,
} from "../controllers/userCtrls.js";

const authRoute = express.Router();

authRoute.post("/signup", create_a_user);
authRoute.post("/login", LoginUser);
authRoute.get("/allusers", getAllUser);
authRoute.get("/:id", getUser);

export default authRoute;
