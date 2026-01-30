import { CreateProductTypeZ, ProductModel } from "../models/product.model";
import { UserModel, type User } from "../models/user.model";
import { AppError } from "../utils/app.error";
import {
  buildSearchQuery,
  parseBoolean,
  parseProjection,
  parseSort,
} from "../utils/query.util";

export const createProduct = async (productData: CreateProductTypeZ) => {
  const existingProduct = await ProductModel.findOne({
    name: productData.name,
  });
  console.log(existingProduct);
  if (existingProduct) throw new AppError("Product already exists", 409);
  const newProduct = await ProductModel.create(productData);
  return newProduct;
};

export const findAll = async () => {
  const ProductUsers = await ProductModel.find({});
  if (ProductUsers.length === 0) {
    throw new AppError("Products not found", 404);
  }
  return ProductUsers;
};

export const findById = async (id: string) => {
  const Product = await ProductModel.findById(id);
  if (!Product) {
    throw new AppError("Product not found", 404);
  }

  return Product;
};

export const updateProductService = async (
  id: string,
  ProductData: Partial<User>,
) => {
  const existingProduct = await ProductModel.findById(id);
  if (!existingProduct) throw new Error("User not found...");
  const updatedProduct = await ProductModel.findByIdAndUpdate(id, ProductData, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) throw new Error("User not found...");
  return updatedProduct;
};

export const deleteProductService = async (id: string) => {
  const deletedProduct = await ProductModel.findByIdAndDelete(id);
  if (!deletedProduct) throw new Error("User not found...");
  return deletedProduct;
};
