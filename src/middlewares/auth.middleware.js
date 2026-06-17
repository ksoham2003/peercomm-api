import jwt from "jsonwebtoken";
import appError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import UserModel from "../models/user.model.js";

/**
 * Authentication middleware to verify JWT token from cookies
 * Attaches authenticated user object to req.user
 * Must be placed before any protected route handlers
 * @throws {appError} If token missing, invalid, or user not found
 */
const authMiddleware = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new appError(401, "Unauthorized access");

  // Verify the cookie token and attach the current user to the request.
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await UserModel.findById(decoded.id);
  if (!user) throw new appError(404, "user not found, please login!");

  req.user = user;
  next();
});

export { authMiddleware };
