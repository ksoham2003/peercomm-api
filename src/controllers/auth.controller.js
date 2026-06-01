import UserModel from "../models/user.model.js";
import appError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/jwt.js";

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  // The user model hashes the password in its pre-save hook.
  const newUser = await UserModel.create({ name, email, password });

  // Store the JWT in a cookie so authenticated routes can read it later.
  const token = generateToken(newUser._id, newUser.email);
  res.cookie("token", token);
  return res.status(200).json({
    message: "User registered successfully",
    user: newUser,
  });
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Keep the error generic so attackers cannot tell which field failed.
  const user = await UserModel.findOne({ email });
  
  if (!user) throw new appError(404, "Invalid email or password");
  
  // Compare the submitted password with the stored bcrypt hash.
  const compare = await user.comparePassword(password);
  if (!compare) throw new appError(401,"Invalid email or password");

  const token = generateToken(user._id, user.email);
  res.cookie("token", token);
  res.status(200).json({ message: "Login successfully", user });
});

export { register, login };
