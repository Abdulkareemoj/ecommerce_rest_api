import express from "express";
import {
  create_product,
  get_all_products,
  getASingleProduct,
} from "../controllers/productCtrls.js";

const productRoute = express.Router();

productRoute.post("/createproduct", create_product);
productRoute.get("/allproducts", get_all_products);
productRoute.get("/:id", getASingleProduct);

export default productRoute;
