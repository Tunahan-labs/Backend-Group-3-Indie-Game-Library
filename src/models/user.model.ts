import mongoose from "mongoose";
import { z } from "zod";

export type UserRole = "user" | "admin";

export interface User {
  name: string;
  email: string;
  age: number;
  password?: string;
  role?: UserRole;
}

export const userZodSchema = z.object({
  body: z.object({
    name: z.string("not valid").min(3),
    email: z.email("not valid"),
    age: z.number("not valid").min(0),
  }),
});

export const registerUserValidation = userZodSchema.extend({
  body: userZodSchema.shape.body.extend({
    password: z
      .string("not valid")
      .min(8, "Password must be at least 8 characters long"),
  }),
});

export const logInUserValidation = z.object({
  body: z.object({
    email: z.email("not valid email"),
    password: z.string("not valid password").min(8),
  }),
});

export type regisetUserTypeZ = z.infer<typeof registerUserValidation>["body"];
export type loginUserTypeZ = z.infer<typeof logInUserValidation>["body"];
export type CreateUserTypeZ = z.infer<typeof userZodSchema>["body"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);
export const UserModel = mongoose.model<User>("User", userSchema);
