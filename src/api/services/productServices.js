import { productModel } from "../models/productsModels.js";
import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../helpers/custom-errors.js";

//Create a Product Service
export const createProductService = async (product) => {
  const newProduct = await productModel.create({ ...product });
  if (!newProduct) {
    throw new CustomAPIError("Product creation failed", StatusCodes.ERROR);
  }
  return newProduct;
};

// Fetch All Products Services
export const getAllProductsService = async (products) => {
  const allProducts = await productModel.find(products);
  if (allProducts.length <= 0) {
    throw new CustomAPIError("No products found", StatusCodes.NO_CONTENT);
  }
  return allProducts;
};

// Get a single product by its ID Service 
export const getSingleProductService = async (productID) => {
  const productExists = await productModel.findById({ _id: productID });
  console.log(productExists);
  if (!productExists) {
    throw new CustomAPIError(
      `the product with the id ${id} does not exist`,
      StatusCodes.NOT_FOUND
    );
  }
  return productExists;
};
