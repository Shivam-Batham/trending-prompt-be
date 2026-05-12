export function setAuthCookies(res, access_token, refresh_token){
    res.cookie("accessToken", access_token,{
        httpOnly:true,
        sameSite:"none",
        secure:true,
    })

    res.cookie("refreshToken", refresh_token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
}

export function clearAuthCookies(res){
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken")
}