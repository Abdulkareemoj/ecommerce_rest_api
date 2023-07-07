import express from "express";
import { isAdmin, auth } from "../middlewares/authMiddleware.js";
import {
  create_product,
  updateSingleProduct,
  deleteProduct,
  get_all_products,
  getASingleProduct,
} from "../controllers/productCtrls.js";

const productRoute = express.Router();

productRoute.post("/createproduct", auth, isAdmin, create_product);
productRoute.get("/allproducts", get_all_products);
productRoute.get("/:id", getASingleProduct);
productRoute.patch("/:id", auth, isAdmin, updateSingleProduct);
productRoute.delete("/:id", auth, isAdmin, deleteProduct);

export default productRoute;
