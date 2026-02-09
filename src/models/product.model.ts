import mongoose from "mongoose";
import { z } from "zod";

export interface Product {
  name: string;
  genre: string;
  platform: string;
  image: string;
  rating: number;
  description: string;
}
export const ProductZodSchema = z.object({
  body: z.object({
    name: z.string("not valid").min(3),
    genre: z.string("not valid").min(3),
    platform: z.string("not valid").min(3),
    image: z.string("not valid").min(3),
    rating: z.number("not valid").min(0),
    description: z.string("not valid").min(1).optional(),
  }),
});

export type CreateProductTypeZ = z.infer<typeof ProductZodSchema>["body"];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    genre: { type: String, required: true },
    platform: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);
export const ProductModel = mongoose.model<Product>("Product", productSchema);
