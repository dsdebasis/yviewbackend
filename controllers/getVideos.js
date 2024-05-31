import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { Video } from "../models/video.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
const getVideos = asyncHandler(async(req,res,next)=>{
let allVideos = await Video.find({},{
  createdAt:false,
  updatedAt:false
})
   

return res.status(200).json(new ApiResponse(200,"successfully fetched all the videos",allVideos))
})

export default getVideos