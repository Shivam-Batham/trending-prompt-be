import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      min: [1, "Name must be at least 1 character long."],
      max: [150, "Name cannot exceed 100 characters"],
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Name is required"],
      min: [1, "Name must be at least 1 character long."],
      max: [50, "Name cannot exceed 100 characters"],
      unique: true,
      trim: true,
      index: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email format."],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [8, "Password must be at least 8 characters long."],
      max: [30, "Password cannot exceed 30 characters"],
    },

    passwordChangedAt: Date,

    contact: {
      type: String,
      max: [20, "Contact cannot exceed 20 charecters"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    permissions: [
      {
        type: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
    },

    refreshToken: {
      type: String,
      select: false,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    avatar: {
      public_id: String,
      url: String,
    },

    bookmarks: [],

    access_token: {
      type: String,
    },
    refresh_token: {
      type: String,
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(this.password, password);
};

UserSchema.methods.genrateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

UserSchema.methods.genrateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESS_TOKEN_EXPIRY },
  );
};

export default User = mongoose.model("User", UserSchema);
