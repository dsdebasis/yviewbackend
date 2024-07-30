import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { User } from "../models/user.model.js"


const authenticate = asyncHandler(async function (req, res, next) {

  const accessToken = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")


  const refreshToken = req.cookies.refreshToken || req.header("Authorization")?.replace("Bearer ", "")

  if (!accessToken) throw new ApiError(400, "No cookies found to verify for access")

  let verifyAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

// console.log("vt",verifyAccessToken._id)
  if (!verifyAccessToken) {

    throw new ApiError(400,"Invalid Access Token .Please generate new  access Token ",)
  }

  if (verifyAccessToken) {
    req.user = await User.findById(verifyAccessToken?._id).select("-password")
    
    next()
  } else {
    throw new ApiError(400, "invalid cookies", "error while cookie verification")
  }

})

export { authenticate }