import { Document } from "mongoose";
import { CartModelInterface } from "./cartModel_Interface";
import { UserDataInterface } from "./user_interface";

export interface checkOutInterface extends Document {
  firstName: UserDataInterface["firstName"];
  lastName: UserDataInterface["lastName"];
  email: UserDataInterface["email"];
  amount:
    | CartModelInterface["totalAfterDiscount"]
    | CartModelInterface["cartTotal"];
  reference: string;
  status: string;
  orderby: CartModelInterface["_id"];
}
