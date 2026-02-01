import jwt from "jsonwebtoken";
import User from "../models/user_model.js";

export async function auth(error, req, res, next) {
  try {
    const token =
      req.cookie?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: true,
        message: "Unauthorized request.",
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res.status(401).json({
        success: true,
        message: "Invalid access token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in authenticating", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}
