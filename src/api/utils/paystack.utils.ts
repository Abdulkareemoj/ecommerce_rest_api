/* 
    create the function that calls paystack-API and 
    submits our transaction details and authorization 
    headers to initialize and verify them.
*/

import dotenv from "dotenv";
import * as request from "request";
import { Form, Callback } from "../interfaces/paystack_init.interface";

dotenv.config();

export const paystack_init = (request: any) => {
  const Secret_key = process.env.PAY_STACK_API_KEY;

  const initializePayment = (form: Form, mycallBack: Callback) => {
    const options = {
      url: "https://api.paystack.co/transaction/initialize",
      headers: {
        authorization: Secret_key,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
      form,
    };
    const callBack: request.RequestCallback = (error, response, body) => {
      return mycallBack(error, body);
    };
    request.post(options, callBack);
  };

  const verifyPayment = (ref: string, mycallBack: Callback) => {
    const options = {
      url:
        "https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref),
      headers: {
        authorization: Secret_key,
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
    };
    const callback: request.RequestCallback = (error, response, body) => {
      return mycallBack(error, body);
    };
    request(options, callback);
  };
  return { initializePayment, verifyPayment };
};
