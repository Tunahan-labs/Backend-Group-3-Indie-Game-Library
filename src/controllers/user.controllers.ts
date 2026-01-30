import { NextFunction, type Request, type Response } from "express";
import { CreateUserTypeZ } from "../models/user.model";
import {
  createUser,
  deleteUserService,
  findAll,
  findById,
  updateUserService,
} from "../services/user.services";

export const create = async (
  req: Request<{}, {}, CreateUserTypeZ>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { age, email, name } = req.body;
    const user = await createUser(age, email, name);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const user = await findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const changes = req.body;
    const updatedUser = await updateUserService(id, changes);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    await deleteUserService(id);

    res.status(200).json({ msg: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
};
