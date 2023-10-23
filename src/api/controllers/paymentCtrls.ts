import { Request, Response } from "express";
import { PaymentService } from "../services/payment.services";

const paymentInstance = new PaymentService();

export class PaymentController {
  public static async startPayment(req: Request, res: Response) {
    try {
      const response = await paymentInstance.startPayment(req.body);
      res.status(201).json({ status: "Success", data: response });
    } catch (error: any) {
      res.status(500).json({ status: "Failed", message: error.message });
    }
  }

  public static async createPayment(req: Request, res: Response) {
    try {
      const response = await paymentInstance.createPayment(req.query);
      res.status(201).json({ status: "Success", data: response });
    } catch (error: any) {
      res.status(500).json({ status: "Failed", message: error.message });
    }
  }

  public static async getPayment(req: Request, res: Response) {
    try {
      const response = await paymentInstance.paymentReceipt(req.body);
      res.status(201).json({ status: "Success", data: response });
    } catch (error: any) {
      res.status(500).json({ status: "Failed", message: error.message });
    }
  }
}
