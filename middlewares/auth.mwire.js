import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/AsyncHandler.js" 
import { User } from "../models/user.model.js"


const authenticate =asyncHandler( async function (req, _,next) {
  
  const accessToken = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")
  
  console.log()
    if (!accessToken) throw new ApiError(400,"No cookies found to verify")
  
    const verifyAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    
    if (verifyAccessToken) {
      req.user = await User.findById(verifyAccessToken._id).select("-password")

      next()

    } else {
      
      throw new ApiError(400,"invalid cookies","error while cookie verification")
    }

  
})

export {authenticate}