export function setAuthCookies(res, access_token, refresh_token){
    res.cookie("accessToken", access_token,{
        httpOnly:true,
        sameSite:"lax",
        secure:true,
        // maxAge:process.env.ACCESS_TOKEN_EXPIRY
    })

    res.cookie("refreshToken", refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    // maxAge: process.env.REFRESS_TOKEN_EXPIRY,
  });
}

export function clearAuthCookies(res){
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken")
}