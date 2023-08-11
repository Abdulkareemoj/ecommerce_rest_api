import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import {
  createProductService,
  getAllProductsService,
  getSingleProductService,
  updateProductService,
  deleteProductService,
} from "../services/productServices";
import { productModel } from "../models/productsModels";
import {
  GetAllProductsOptions,
  GetAllProductsQueryParams,
} from "../interfaces/product_Interface";

// create a new product controller
export const create_product = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    // calling the createProduct controller
    const newProduct = await createProductService(req.body);
    //console.log(newProduct);
    res
      .status(StatusCodes.CREATED)
      .json({ ProductData: { ProductDetail: newProduct } });
  }
);

// get all products controller
export const get_all_products = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Filtering products
    const queryObject = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObject[el]);
    // console.log(`Query: ${queryObject}`);
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const { sortBy, sortOrder, limit, page, category, brand } =
      req.query as GetAllProductsQueryParams;

    const options: GetAllProductsOptions = {
      sortBy: sortBy || "createdAt", // Default sorting by createdAt
      sortOrder: sortOrder === "desc" ? "desc" : "asc",
      limit: limit ? parseInt(limit.toString(), 10) : 10,
      page: page ? parseInt(page.toString(), 10) : 1,
      category: category || "",
      brand: brand || "",
    };

    let allProducts = await getAllProductsService(productModel, options);

    res
      .status(StatusCodes.OK)
      .json({ numberOfProducts: allProducts.length, allProducts });
  }
);

// getting a single product
export const getASingleProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    //console.log(id);
    const productDataID = await getSingleProductService(id);
    res.status(StatusCodes.OK).json({ product: productDataID });
  }
);

// update a single product controller
export const updateSingleProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    const { id } = req.params;
    console.log(id);
    const updateProduct = await updateProductService(id, req.body);
    res
      .status(StatusCodes.OK)
      .json({ status: "Successfully updated product", updateProduct });
  }
);

// Deleting a product controller action
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const productDataID = await deleteProductService(id);
    res.status(StatusCodes.OK).json({
      status: "Deleted product Successfully",
      productDataID: productDataID,
    });
  }
);
