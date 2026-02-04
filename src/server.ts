// src/server.ts
import dotenv from "dotenv";
import { createApp } from "./app";
import mongoose from "mongoose";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
const MONGO_URL = process.env.MONGO_URL ?? "mongodb://localhost:27017/myapp";
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = createApp();

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.info(" Connected to MongoDB");
    const app = createApp();
    app.listen(PORT, () => {
      console.log(
        `• Server running in ${NODE_ENV} mode on http://localhost:${PORT}`,
      );
    });
  } catch (error) {
    console.error("L Failed to start server");
    console.error(error);
    process.exit(1);
  }
};
startServer();
