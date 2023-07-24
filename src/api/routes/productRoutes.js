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
productRoute.use(auth);
productRoute.use(isAdmin);
productRoute.patch("/:id", updateSingleProduct);
productRoute.delete("/:id", deleteProduct);

export default productRoute;
