import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "name should be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "Password should be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

/**
 * Pre-save middleware to hash password before storing
 * Only hashes if password is new or modified
 */
userSchema.pre("save", function () {
  if (!this.isModified("password")) return;

  this.password = bcrypt.hashSync(this.password, 10);
});

/**
 * Compare provided password with stored bcrypt hash
 * @param {string} password - Plain text password to verify
 * @returns {boolean} True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
