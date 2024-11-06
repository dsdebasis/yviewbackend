
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"

const getChannel = asyncHandler(async (req, res, next) => {

  // console.log(req.user._id)
  let userChannelDetails = await User.findById(req.user._id)
  let uploadedVideos;

  if (userChannelDetails.channel !== undefined) {

    userChannelDetails = await userChannelDetails.populate("channel")
    uploadedVideos = userChannelDetails
    userChannelDetails = userChannelDetails.channel.toObject()

    
   let allVideos = await Video.find({owner:req.user._id},{
    createdAt:false,
    updatedAt:false,
    owner:false
   })
  //  console.log("av",allVideos)



  let totalViews = await Video.aggregate([
    {$match:{owner:req.user._id}},
    {$group:{_id:"$owner",totalViews:{$sum:"$views"}}}
  ])

  userChannelDetails.totalViews = totalViews[0].totalViews

  res.status(200).json(new ApiResponse(200, "successfully fetched channel details", {userChannelDetails,allVideos})) 
    
    
  } else {
    throw new ApiError(400, "no channel found. Create a channel")
  }

})

export default getChannel
