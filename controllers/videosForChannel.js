import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";

const getVideoForChannel = asyncHandler(async (req, res, next) => {
  console.log(req.channelOwner)

  
  let getAllVideos = await Video.findById(req.channelOwner._id)
  res.set('Cache-Control', 'public, max-age=3600')
  return res.json(getAllVideos)
}) 

export default getVideoForChannel;