
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"


const getChannel = asyncHandler(async(req,res,next)=>{

  const userChannelDetails =await User.findById(req.user._id).populate("channel").select("channel")
 
  if(userChannelDetails !== undefined){
    
    return res.status(200).json(new ApiResponse(200,"successfully fetched channel details",userChannelDetails))
  } else{
    throw new ApiError(400,"no channel found")
  }
  
})

export default getChannel
