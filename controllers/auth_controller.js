import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Session from "../models/session.js";
import { signAccessToken, signRefreshToken } from "../utils/tokens.js";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({
        success: false,
        message: "User email and password are required.",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const isPasswordCorrect = await user?.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(403).json({
        success: "Incorrect password.",
      });
    }

    const sessionId = crypto.randomUUID();

    await Session.create({
      userId: user._id,
      sessionId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    const access_token = signAccessToken(user._id.toString(), user.name);
    const refresh_token = signRefreshToken(user._id.toString(), sessionId);

    setAuthCookies(res, access_token, refresh_token);

    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User logged in successfully.",
    });
  } catch (error) {
    console.error("Error while login", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function refreshSession(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Missing token.",
      });
    }

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const session = await Session.findOne({
      sessionId: payload.sessionId,
      revoked: false,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid session.",
      });
    }

    if (session.expiresAt < new Date()) {
      return res.status(403).json({
        success: false,
        message: "Invalid session.",
      });
    }

    await Session.deleteOne({ sessionId: payload.sessionId });

    const newSessionId = crypto.randomUUID();

    await Session.create({
      userId: payload.userId,
      sessionId: newSessionId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    const newAccessToken = signAccessToken(payload.userId);
    const newRefreshToken = signRefreshToken(payload.userId, newSessionId);

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Session refreshed.",
    });
  } catch (error) {
    console.error("Error while login", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.userId).select("_id  role");

    if(!user){
      return res.status(404).json({
        success:false,
        message: "Failed to fetch current user.",
      })
    }

    return res.status(200).json({
      user:user,
      success: true,
    });
  } catch (error) {
    console.error("Error while login", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      await Session.updateOne(
        { sessionId: payload.sessionId },
        { revoked: true },
      );
    }

    clearAuthCookies(res);
    return res.status(200).json({
      success: true,
      message: "User logged out succesfully.",
    });
  } catch (error) {
    console.error("Error while logout", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
