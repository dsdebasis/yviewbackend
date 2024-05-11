import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { User } from "../models/user.model.js"


const authenticate = asyncHandler(async function (req, res, next) {

  const accessToken = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")

  const refreshToken = req.cookies.refreshToken || req.header("Authorization")?.replace("Bearer ", "")

  if (!accessToken) throw new ApiError(400, "No cookies found to verify")

  let verifyAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

  let verifyRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

  
  if (!verifyAccessToken) {
    // const options = {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   path: "/",
    //   expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    // }
    // if (verifyAccessToken == false) {
    //   let user = await User.findById(verifyRefreshToken._id)
    //   accessToken = user.genAccessToken()

    //   console.log(verifyRefreshToken)
    //   res.cookie("accessToken", accessToken, options)
    //   verifyAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    // }
    console.log('OKAY')
  }

  if (verifyAccessToken) {
    req.user = await User.findById(verifyAccessToken._id).select("-password")
    next()
  } else {
    throw new ApiError(400, "invalid cookies", "error while cookie verification")
  }

})

export { authenticate }