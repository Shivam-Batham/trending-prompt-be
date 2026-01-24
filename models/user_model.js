import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      min: [1, "Name must be at least 1 character long"],
      max: [150, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Name is required"],
      min: [1, "Name must be at least 1 character long"],
      max: [50, "Name cannot exceed 100 characters"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [8, "Password must be at least 8 characters long"],
      max: [100, "Password cannot exceed 100 characters"],
    },

    contact: {
      type: String,
      max: [30, "Contact cannot exceed 30 charecters"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    saves:[],

    access_token: {
      type: String,
    },
    refresh_token: {
      type: String,
    },

    role: {
      type: String,
    },
  },
  { timestamps: true },
);

export default User = mongoose.model("User", UserSchema);
