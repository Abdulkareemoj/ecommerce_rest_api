import express from "express";
import {create_a_user} from "../controllers/userCtrls.js";

const authRoute = express.Router();

authRoute.post("/signup", create_a_user);

export default authRoute;
