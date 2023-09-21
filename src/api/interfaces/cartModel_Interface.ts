import { Document, Types } from "mongoose";
import { ProductDataInterface } from "../interfaces/product_Interface";

export interface CartModelInterface extends Document {
    products: ProductDataInterface[];
    cartTotal: number;
    totalAfterDiscount: number;
    orderby: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}