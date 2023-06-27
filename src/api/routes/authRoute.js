import express from "express";
import { create_a_user, LoginUser } from "../controllers/userCtrls.js";

const authRoute = express.Router();

authRoute.post("/signup", create_a_user);
authRoute.post("/login", LoginUser);

export default authRoute;
