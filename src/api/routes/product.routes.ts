import express from "express";
import { auth, isAdmin } from "../middlewares/authMiddleware";
import {
  create_product,
  updateSingleProduct,
  deleteProduct,
  get_all_products,
  getASingleProduct,
  addToWishList,
  rateProduct,
} from "../controllers/productCtrls";

const productRoute = express.Router();

productRoute.get("/allproducts", get_all_products);
productRoute.get("/:id", getASingleProduct);
productRoute.use(auth);
productRoute.use(isAdmin);
productRoute.post("/createproduct", create_product);
productRoute.patch("/:id", updateSingleProduct);
productRoute.delete("/:id", deleteProduct);
productRoute.put("/wishlist", auth, addToWishList);
productRoute.put("/rateproduct", auth, rateProduct);

export default productRoute;
