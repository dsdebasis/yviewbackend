import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/AsyncHandler.js" 


const authenticate =asyncHandler( async function (req, _,next) {
  // console.log(req.cookies)
  const accessToken = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")
  // console.log(accessToken)
 
    if (!accessToken) throw new ApiError(400,"No cookies found")
  
    const verifyAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    
    if (verifyAccessToken) {
      req.user = verifyAccessToken
      next()

    } else {
      
      throw new ApiError(400,"invalid cookies","error while cookie verification")
    }

  
})

export {authenticate}