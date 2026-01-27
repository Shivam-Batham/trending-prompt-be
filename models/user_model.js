import mongoose from "mongoose";
import validator from "validator"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      min: [1, "Name must be at least 1 character long."],
      max: [150, "Name cannot exceed 100 characters"],
      index:true,
      trim:true
    },
    email: {
      type: String,
      required: [true, "Name is required"],
      min: [1, "Name must be at least 1 character long."],
      max: [50, "Name cannot exceed 100 characters"],
      unique: true,
      trim:true,
      index:true,
      lowercase:true,
      validate:[validator.isEmail,'Invalid email format.']
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [8, "Password must be at least 8 characters long."],
      max: [30, "Password cannot exceed 30 characters"],
    },

    passwordChangedAt:Date,

    contact: {
      type: String,
      max: [20, "Contact cannot exceed 20 charecters"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index:true
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

    bookmarks:[],

    access_token: {
      type: String,
    },
    refresh_token: {
      type: String,
    },
  },
  { timestamps: true },
);

export default User = mongoose.model("User", UserSchema);
