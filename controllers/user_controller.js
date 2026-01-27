import mongoose from "mongoose";
import User from "../models/user_model";

export async function createUser(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!(email && password && name)) {
      return res.status(400).json({
        status: false,
        message: "All feilds are required.",
      });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists.",
      });
    }

    let user = new User({
      name,
      email,
      password,
    });

    user = await user.save();

    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      status: true,
      message: "user created successfully.",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error while creating user.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "user id is required.",
      });
    }

    const existingUser = await User.findById(id).select("-password");
    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "user does not exists.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "user found",
      data: existingUser,
    });
  } catch (error) {
    console.error("Error while fetching user.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getAllUser(req, res) {
  try {
    if (!req?.user || !req.user.role !== "admin") {
      return res.status(403).json({
        status: false,
        message: "Access denied.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password -__v")
      .skip(skip)
      .limit(limit)
      .lean();

    const totalUsers = await User.countDocuments();

    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      total: totalUsers,
      page,
      limit,
      data: users,
    });
  } catch (error) {
    console.error("Error while fetching users.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function updateUser(params) {
  try {
  } catch (error) {}
}

export async function deleteUser(req,res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "user id is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid user id.",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "user not found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "user deactivated successfully.",
    });
  } catch (error) {
    console.error("Error while deleting user.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
