import mongoose from "mongoose";
import { z } from "zod";

export interface Product {
  name: string;
  price: number;
  description: string;
  stock: number;
  category: string;
}
export const ProductZodSchema = z.object({
  body: z.object({
    name: z.string("not valid").min(3),
    price: z.number("not valid").min(0),
    description: z.string("not valid").min(1),
    stock: z.number("not valid").min(0),
    category: z.string("not valid").min(1),
  }),
});

export type CreateProductTypeZ = z.infer<typeof ProductZodSchema>["body"];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true },
);
export const ProductModel = mongoose.model<Product>("Product", productSchema);
