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

// updating a product Service
export const updateProductService = async (prodId, updateData) => {
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
