import { productModel } from "../models/productsModels.js";
import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../helpers/custom-errors.js";
import { Types } from "mongoose"; // Import necessary types from Mongoose
import { ProductDataInterface } from "../interfaces/product_Interface"; // Import ProductDataInterface

//Create a Product Service
export const createProductService = async (product:ProductDataInterface) => {
  const newProduct = await productModel.create({ ...product });
  if (!newProduct) {
    throw new CustomAPIError("Product creation failed", StatusCodes.BAD_REQUEST);
  }
  return newProduct;
};

// Fetch All Products Services
export const getAllProductsService = async () => {
  const allProducts = await productModel.find({});
  if (allProducts.length <= 0) {
    throw new CustomAPIError("No products found", StatusCodes.NO_CONTENT);
  }
  return allProducts;
};

// Get a single product by its ID Service
export const getSingleProductService = async (productID: string) => {
  const productExists = await productModel.findById({ _id: productID });
  console.log(productExists);
  if (!productExists) {
    throw new CustomAPIError(
      `the product with the id ${productID} does not exist`,
      StatusCodes.NOT_FOUND
    );
  }
  return productExists;
};

// updating a product Service
export const updateProductService = async (prodId) => {
  const { id } = prodId;
  const updateProduct = await productModel.findByIdAndUpdate(
    { _id: id },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(prodId);
  if (!updateProduct)
    throw new CustomAPIError(
      `The Product with the id: ${id} was not found to be updated.`,
      StatusCodes.NOT_FOUND
    );
  return updateProduct;
};

// Deleting a product Service
export const deleteProductService = async (prodID) => {
  const { id } = prodID;
  const product = await productModel.findOneAndDelete({ _id: id });
  console.log(product);
  if (!product)
    throw new CustomAPIError(
      `The Product with the id: ${id} was not found to be deleted`
    );
  return product;
};
