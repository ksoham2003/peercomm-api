import UserModel from "../models/user.model.js";
import appError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/jwt.js";

/**
 * Register a new user account
 * @param {Object} req - Express request object
 * @param {string} req.body.name - User's full name (min 3 chars)
 * @param {string} req.body.email - Unique email address
 * @param {string} req.body.password - Password (min 6 chars)
 * @param {string} req.body.confirmPassword - Password confirmation (must match password)
 * @param {Object} res - Express response object
 * @returns {Object} Success message with created user object
 * @throws {appError} If email already exists or validation fails
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // The user model hashes the password in its pre-save hook.
  const newUser = await UserModel.create({ name, email, password });

  // Store the JWT in a secure cookie for authenticated routes
  const token = generateToken(newUser._id, newUser.email);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return res.status(200).json({
    message: "User registered successfully",
    user: newUser,
  });
});
/**
 * Login an existing user
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Object} Success message with user object and JWT cookie
 * @throws {appError} If email/password are invalid
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Keep the error generic so attackers cannot tell which field failed.
  const user = await UserModel.findOne({ email });
  
  if (!user) throw new appError(401, "Invalid email or password");
  
  // Compare the submitted password with the stored bcrypt hash.
  const compare = await user.comparePassword(password);
  if (!compare) throw new appError(401, "Invalid email or password");

  const token = generateToken(user._id, user.email);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.status(200).json({ message: "Login successful", user });
});

export { register, login };
