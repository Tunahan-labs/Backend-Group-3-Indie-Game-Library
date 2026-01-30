import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../utils/app.error";
import { UserRole } from "../models/user.model";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError("unauthorised", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const payload = decoded as JwtPayload;

    req.user = { id: payload.id, role: payload.role };

    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo = (roles: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "forbidden, You do not have required permissions" });
    }
    next();
  };
};
