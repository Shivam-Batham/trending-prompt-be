import User from "../models/user_model.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({
        success: false,
        message: "User email and password are rewuired.",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user does not exists.",
      });
    }

    const isPasswordCorrect = await User?.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(403).json({
        success: "Incorrect password.",
      });
    }

    const access_token = User?.genrateAccessToken();
    const refresh_token = User?.genrateRefreshToken();

    user.refreshToken = refresh_token;
    await user.save({ validateBeforeSave: false }, { new: true });

    res.setHeader("Authorization", `Bearer ${access_token}`);
    res.setHeader("Refresh-token", refresh_token);

    const option = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", access_token, option)
      .cookie("refreshToken", refresh_token, option)
      .json({
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

export async function logout(req, res) {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      { new: true },
    );

    const option = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", option)
      .clearCookie("refreshToken", option)
      .json({
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
