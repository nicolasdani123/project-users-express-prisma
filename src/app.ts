import express from "express";
import cors from "cors";
import errorHandler from "./core/middleware/errorHandler.js";
import userRouter from "./core/router/user.router.js";

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/users", userRouter);

// Error handler (must be last)
app.use(errorHandler);

export default app;
