import { Document, Types } from "mongoose";
import { ProductDataInterface } from "../interfaces/product_Interface";

export interface OrderInterface extends Document {
  products: ProductDataInterface[];
  paymentIntent: any;
  orderStatus:
    | "Not Processed"
    | "Cash on Delivery"
    | "Processing"
    | "Dispatched"
    | "Cancelled"
    | "Delivered";
  orderby: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateOrderStatusParams {
  id: string;
  status: string;
}
