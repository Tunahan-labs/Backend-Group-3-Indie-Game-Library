import { UserModel, type User } from "../models/user.model";
import { AppError } from "../utils/app.error";

export const createUser = async (age: number, email: string, name: string) => {
  const existingUser = await UserModel.findOne({ email });
  console.log(existingUser);
  if (existingUser) throw new AppError("user alrady exists", 409);
  const newUser = { age, email, name };
  return newUser;
};

export const findAll = async () => {
  const allUsers = await UserModel.find({});
  if (allUsers.length === 0) {
    throw new AppError("users not found", 404);
  }
  return allUsers;
};

export const findById = async (id: string) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new AppError("user not found", 404);
  }

  return user;
};

export const updateUserService = async (
  id: string,
  updateData: Partial<User>
) => {
  const existingUser = await UserModel.findById(id);
  if (!existingUser) throw new Error("User not found...");
  const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) throw new Error("User not found...");
  return updatedUser;
};

export const deleteUserService = async (id: string) => {
  const deletedUser = await UserModel.findByIdAndDelete(id);
  if (!deletedUser) throw new Error("User not found...");
  return deletedUser;
};
