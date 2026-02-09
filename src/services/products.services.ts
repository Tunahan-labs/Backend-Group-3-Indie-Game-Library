import e from "express";
import { ProductModel, type Product } from "../models/product.model";

import { AppError } from "../utils/app.error";

export const createProducts = async (name: string) => {
  const existingProduct = await ProductModel.findOne({ name });
  if (existingProduct) {
    throw new AppError("Product name already used", 403);
  }
  const newProduct = await ProductModel.create({ name } as Product);
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
  ProductData: Partial<Product>,
) => {
  const existingProduct = await ProductModel.findById(id);
  if (!existingProduct) throw new Error("product not found...");
  const updatedProduct = await ProductModel.findByIdAndUpdate(id, ProductData, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) throw new Error("product not found...");
  return updatedProduct;
};

export const deleteProductService = async (id: string) => {
  const deletedProduct = await ProductModel.findByIdAndDelete(id);
  if (!deletedProduct) throw new Error("product not found...");
  return deletedProduct;
};

export const getAllProducts = async () => {
  const allProducts = await ProductModel.find({});
  return allProducts;
};
