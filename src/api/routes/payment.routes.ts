import express from "express";
import { PaymentController } from "../controllers/paymentCtrls";
import { auth } from "../middlewares/authMiddleware";

// const paymentCtrl = new PaymentController();

const paymentRouter = express.Router();

paymentRouter.use(auth);

paymentRouter.post("/", PaymentController.startPayment);
paymentRouter.get("/createPayment", PaymentController.createPayment);
paymentRouter.get("/paymentDetails", PaymentController.getPayment);

export default paymentRouter;
