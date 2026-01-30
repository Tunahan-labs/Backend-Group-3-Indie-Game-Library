import express, { type Request, type Response } from "express";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/products.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middelware";

export const createApp = () => {
  const app = express(); // Global middleware (runs on every request)
  app.use(express.json());

  app.use("/api/users", userRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/auth", authRoutes);

  // error handling middleware
  app.use(errorHandler);

  // Health check (quick way to verify server is alive)
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });
  return app;
};
