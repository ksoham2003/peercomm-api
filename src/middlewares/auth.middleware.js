import jwt from "jsonwebtoken";
import appError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import UserModel from "../models/user.model.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new appError(401, "Unauthorized access");

  // Verify the cookie token and attach the current user to the request.
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decoded);
  const user = await UserModel.findById(decoded.id);
  if (!user) throw new appError(404, "user not found, please login!");

  req.user = user;
  next();
});

export { authMiddleware };
