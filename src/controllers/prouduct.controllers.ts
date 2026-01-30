import { NextFunction, type Request, type Response } from "express";
import {
  createProduct,
  deleteProductService,
  findAll,
  findById,
  updateProductService,
} from "../services/products.services";
import {
  CreateProductTypeZ,
  Product,
  ProductModel,
} from "../models/product.model";
import {
  ListResult,
  ProductListQueryParams,
  ProductListRequest,
} from "../types/query.types";
import {
  capLimit,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  parseBoolean,
  toPositiveInteger,
  parseSort,
  parseProjection,
  buildSearchQuery,
} from "../utils/query.util";

export const create = async (
  req: Request<{}, {}, CreateProductTypeZ>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productData = req.body;
    const product = await createProduct(productData);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const allowedSearchFields = ["name", "description", "category"] as const;
const allowedSortFields = ["name", "price", "createdAt", "category"] as const;
const allowedProjectionFields = [
  "name",
  "price",
  "description",
  "stock",
  "category",
  "createdAt",
  "updatedAt",
] as const;

export const list = async (
  params: ProductListRequest,
): Promise<ListResult<Product>> => {
  const {
    page,
    limit,
    sort,
    fields,
    search,
    category,
    minPrice,
    maxPrice,
    inStock,
  } = params;

  const filters: Record<string, unknown> = {};

  if (category) filters.category = category;

  const priceFilter: Record<string, number> = {};
  if (minPrice) {
    const parsed = Number(minPrice);
    if (!Number.isNaN(parsed)) priceFilter.$gte = parsed;
  }
  if (maxPrice) {
    const parsed = Number(maxPrice);
    if (!Number.isNaN(parsed)) priceFilter.$lte = parsed;
  }
  if (Object.keys(priceFilter).length > 0) {
    filters.price = priceFilter;
  }

  const inStockBool = parseBoolean(inStock);
  if (inStockBool !== undefined) {
    filters.inStock = inStockBool ? { $gt: 0 } : { $lte: 0 };
  }

  const searchQuery = buildSearchQuery(search, [...allowedSearchFields]);
  const query: Record<string, unknown> = { ...filters, ...searchQuery };

  const sortBy = parseSort(sort, [...allowedSortFields], "-createdAt");
  const projection = parseProjection(fields, [...allowedProjectionFields]);

  const skip = (page - 1) * limit;

  const findQuery = ProductModel.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);
  if (projection) {
    findQuery.select(projection);
  }

  const [data, total] = await Promise.all([
    findQuery.exec(),
    ProductModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      page: pageParam,
      limit: limitParam,
      sort,
      fields,
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
    } = req.query as ProductListQueryParams;

    const page = toPositiveInteger(pageParam, DEFAULT_PAGE);
    const limit = capLimit(toPositiveInteger(limitParam, DEFAULT_LIMIT));

    const options: ProductListRequest = {
      page,
      limit,
      sort,
      fields,
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
    };

    const products = await list(options);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const product = await findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const changes = req.body;
    const updatedProduct = await updateProductService(id, changes);
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    await deleteProductService(id);

    res.status(200).json({ msg: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
};
