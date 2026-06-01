import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: [3, "name should be atleast 3 charecters"],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      min: [6, "Password contains atleast 6 charecters"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Hash the password whenever it is first set or later changed.
userSchema.pre("save", function () {
  if (!this.isModified("password")) return;

  this.password = bcrypt.hashSync(this.password, 10);
});

// Compare login input against the stored bcrypt hash.
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
