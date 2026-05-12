import jwt from "jsonwebtoken";

export function signAccessToken(userId){
    return jwt.sign(
        {userId},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
    )
}

export function signRefreshToken(userId,sessionId){
    return jwt.sign(
        {userId, sessionId},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESS_TOKEN_EXPIRY}
    )

}