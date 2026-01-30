import {
  loginUserTypeZ,
  regisetUserTypeZ,
  UserModel,
} from "../models/user.model";
import bcrypt from "bcrypt";
import { AppError } from "../utils/app.error";
import jwt, { SignOptions } from "jsonwebtoken";

export const registerUserService = async (userData: regisetUserTypeZ) => {
  const { age, email, name, password } = userData;

  // registration logic-password
  const hashed = await bcrypt.hash(password, 10);

  const newUser = {
    name,
    email,
    age,
    password: hashed,
  };
  const createdUser = await UserModel.create(newUser);

  return createdUser;
};

export const loginUserService = async (userCredantials: loginUserTypeZ) => {
  const { email, password } = userCredantials;
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password!);

  if (!isPasswordValid) {
    throw new AppError("invalid email or password", 401);
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new AppError("jwt secret is not set", 500);
  }

  const expiresIn = (process.env.JWT_EXPIERS_IN ??
    "1d") as SignOptions["expiresIn"];

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    jwtSecret,
    {
      expiresIn,
    },
  );

  user.password = undefined;
  return { user, token };
};
