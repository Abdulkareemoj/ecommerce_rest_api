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
  rateProductService,
  uploadImageService,
} from "../services/product.services";
import {
  GetAllProductsOptions,
  GetAllProductsQueryParams,
} from "../interfaces/product_Interface";
import { AuthenticatedRequest } from "../interfaces/authenticateRequest";
import { validateMongoDbID } from "../helpers/validateDbId";
import { UploadedFile } from "express-fileupload";

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
    const { sortBy, sortOrder, limit, page, category, brand } =
      req.query as GetAllProductsQueryParams;

    const filterOpt: GetAllProductsOptions = {
      sortBy: sortBy || "createdAt", // Default sort order
      sortOrder: sortOrder === "desc" ? "desc" : "asc",
      limit: limit ? parseInt(limit.toString(), 10) : 10,
      page: page ? parseInt(page.toString(), 10) : 1,
      category: category || "",
      brand: brand || "",
    };

    const paginatedProducts = await getAllProductsService(filterOpt);
    res.status(StatusCodes.OK).json(paginatedProducts);
  }
);

// getting a single product
export const getASingleProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    validateMongoDbID(id);
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
    validateMongoDbID(id);
    // console.log(id);
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
    validateMongoDbID(id);
    const productDataID = await deleteProductService(id);
    res.status(StatusCodes.OK).json({
      status: "Deleted product Successfully",
      productDataID: productDataID,
    });
  }
);

export const rateProduct = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req?.user?.id;
  if (userId) {
    const { star, prodId, comment } = req.body;

    try {
      const finalProduct = await rateProductService(
        userId,
        prodId,
        star,
        comment
      );
      res.json(finalProduct);
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
    }
  } else {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "User not authenticated" });
  }
};

export const uploadImageCtrl = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDbID(id);
    const files = req.files as Record<string, UploadedFile | UploadedFile[]>;

    try {
      const findProduct = await uploadImageService(id, files);
      res.status(StatusCodes.OK).json(findProduct);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);
