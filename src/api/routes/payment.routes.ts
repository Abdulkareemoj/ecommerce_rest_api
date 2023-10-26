import express from "express";
import { PaymentController } from "../controllers/paymentCtrls";
import { auth } from "../middlewares/authMiddleware";

// const paymentCtrl = new PaymentController();

const paymentRouter = express.Router();

paymentRouter.use(auth);

paymentRouter.post("/createpayment", PaymentController.startPayment);
paymentRouter.get("/createpayment", PaymentController.createPayment);
paymentRouter.get("/paymentdetails", PaymentController.getPayment);

export default paymentRouter;
