import * as request from "request";
import { checkoutModel } from "../models/checkout_model";
import loadash from "lodash";
import { paystack_init } from "../utils/paystack.utils";
import { Form, PaymentData } from "../interfaces/paystack_init.interface";

const { initializePayment, verifyPayment } = paystack_init(request);

export class PaymentService {
  startPayment(data: PaymentData) {
    return new Promise(async (resolve, reject) => {
      try {
        const form: Form = {
          price: data.amount * 100,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          metadata: {
            full_name: data.firstName + " " + data.lastName,
          },
        };
        initializePayment(form, (error, response: request.Response, body) => {
          if (error) {
            reject(error.message);
          }
          const body_ = Response.body;
          const parsedBody = JSON.parse(body_);

          return resolve(JSON.stringify(parsedBody));
        });
      } catch (error: any) {
        error.source = "Start Payment Service";
        return reject(error);
      }
    });
  }

  createPayment(req: Request) {
    const ref = req.reference;
    if (ref == null) {
      return reject({ code: 400, msg: "No Reference Passed in the query!" });
    }
    return new Promise(async (resolve, reject) => {
      try {
        verifyPayment(ref, (error, body) => {
          if (error) {
            reject(error.message);
          }
          const response = JSON.parse(body);

          const { reference, amount, status } = response.data;
          const { email } = response.data.customer;
          const full_name = response.data.metadata.full_name;
          const newPayment = { reference, amount, email, full_name, status };
          const payment = checkoutModel.create(newPayment);

          return resolve(payment);
        });
      } catch (error: any) {
        error.source = "Create Payment Service";
        return reject(error);
      }
    });
  }
  paymentReceipt(body) {
    return new Promise(async (resolve, reject) => {
      try {
        const reference = body.reference;
        const transaction = checkoutModel.findOne({ reference: reference });
        return resolve(transaction);
      } catch (error: any) {
        error.source = "Payment Receipt";
        return reject(error);
      }
    });
  }
}
