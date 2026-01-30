import { NextFunction, Request, Response } from "express";
import {
  loginUserService,
  registerUserService,
} from "../services/auth.service";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, age, email, password } = req.body;
  try {
    const newUser = await registerUserService({ name, email, age, password });
    newUser.password = undefined;
    res
      .status(201)
      .json({ message: "account created successfully", user: newUser });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  try {
    const newUser = await loginUserService({ email, password });
    res.status(201).json({ message: "login successfully", user: newUser });
  } catch (error) {
    next(error);
  }
};
