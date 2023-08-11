import { productModel } from "../models/productsModels";
import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../helpers/custom-errors";
import { Types, Model } from "mongoose"; // Import necessary types from Mongoose
import {
  ProductDataInterface,
  GetAllProductsOptions,
} from "../interfaces/product_Interface"; // Import ProductDataInterface

//Create a Product Service
export const createProductService = async (product: ProductDataInterface) => {
  const newProduct = await productModel.create({ ...product });
  if (!newProduct) {
    throw new CustomAPIError(
      "Product creation failed",
      StatusCodes.BAD_REQUEST
    );
  }
  return newProduct;
};

// Fetch All Products Services
export const getAllProductsService = async (
  productModel: Model<ProductDataInterface>,
  options: GetAllProductsOptions
): Promise<ProductDataInterface[]> => {
  // Sorting, limiting and pagination of the Products
  const { sortBy, sortOrder, limit, page, category, brand } = options;
  const skip = (page - 1) * limit;

  const sortCriteria: any = {};
  sortCriteria[sortBy] = sortOrder === "asc" ? 1 : -1;

   const query: any = {};

   if (category) {
     query.category = category;
   }

   if (brand) {
     query.brand = brand;
   }

  const allProducts = await productModel
    .find()
    .sort(sortCriteria)
    .skip(skip)
    .limit(limit)
    .exec();
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
export const updateProductService = async (
  prodId: string,
  updateData: Partial<ProductDataInterface>
) => {
  // const { _id } = prodId;
  const updateProduct = await productModel.findByIdAndUpdate(
    { _id: prodId },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(prodId);
  if (!updateProduct)
    throw new CustomAPIError(
      `The Product with the id: ${prodId} was not found to be updated.`,
      StatusCodes.NOT_FOUND
    );
  return updateProduct;
};

// Deleting a product Service
export const deleteProductService = async (prodID: string) => {
  const product = await productModel.findOneAndDelete({ _id: prodID });
  console.log(product);
  if (!product)
    throw new CustomAPIError(
      `The Product with the id: ${prodID} was not found to be deleted`,
      StatusCodes.BAD_REQUEST
    );
  return product;
};
