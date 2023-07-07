import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import {
  createProductService,
  getAllProductsService,
  getSingleProductService,
  updateProductService,
  deleteProductService,
} from "../services/productServices.js";

// create a new product controller
export const create_product = asyncHandler(async (req, res) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  // calling the createProduct controller
  const newProduct = await createProductService(req.body);
  //console.log(newProduct);
  return res
    .status(StatusCodes.CREATED)
    .json({ ProductData: { ProductDetail: newProduct } });
});

// get all products controller
export const get_all_products = asyncHandler(async (req, res) => {
  const allprods = await getAllProductsService();
  //   console.log(allprods);
  return res
    .status(StatusCodes.OK)
    .json({ numberOfProducts: allprods.length, products: allprods });
});

// getting a single product
export const getASingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const productDataID = await getSingleProductService(id);
  return res.status(StatusCodes.OK).json({ product: productDataID });
});

// update a single product controller
export const updateSingleProduct = asyncHandler(async (req, res) => {
  if (req.body.title) req.body.slug = slugify(req.body.title);
  const { id } = req.params;
  console.log(id);
  const updateProduct = await updateProductService({ id }, req.body);
  return res
    .status(StatusCodes.OK)
    .json({ status: "Successfully updated product", updateProduct });
});

// Deleting a product controller action
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const productDataID = await deleteProductService({ id });
  return res.status(StatusCodes.OK).json({
    status: "Deleted product Successfully",
    productDataID: productDataID,
  });
});
