import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import {
  createProductService,
  getAllProductsService,
  getSingleProductService,
} from "../services/productServices.js";

// create a new product
export const create_product = asyncHandler(async (req, res) => {
  // calling the createProduct service
  const newProduct = await createProductService(req.body);
  //console.log(newProduct);
  return res
    .status(StatusCodes.CREATED)
    .json({ ProductData: { ProductDetail: newProduct } });
});

export const get_all_products = asyncHandler(async (req, res) => {
  const allprods = await getAllProductsService();
  //   console.log(allprods);
  return res
    .status(StatusCodes.OK)
    .json({ numberOfProducts: allprods.length, products: allprods });
});

export const getASingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const productDataID = await getSingleProductService(id);
  return res.status(StatusCodes.OK).json({ product: productDataID });
});
