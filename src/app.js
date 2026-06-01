import cookieParser from "cookie-parser";
import express from "express";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import imagekitRoutes from "./routes/imagekit.routes.js";

const app = express();

// Parse form bodies, JSON payloads, and auth cookies for all routes.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Root health-check endpoint.
app.get("/", (req, res) => {
  return res.status(200).json({ message: "peerComm api is running..." });
});

// Main feature routes.
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/imagekit", imagekitRoutes);

// Fallback for unknown endpoints.
app.use((req, res) => {
  return res.status(404).json({ success: false, message: "Route not Found!" });
});

// Central error response handler for thrown appError instances and other errors.
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  // console.log(...error.message);
  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error (from: GEH)",
  });
});
export default app;
