import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { cloduinaryVideoUpload } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import Channel from "../models/channel.model.js"
const handleVideoUpload = asyncHandler(async (req, res) => {

  // console.log(req.user.channel)
  if (req.user.channel == undefined) {
    throw new ApiError(400, "you don't have any channel.Please create a channel")
  }
  const video = req.file?.path
  const { videoTitle, videoDes } = req.body
  if (video == undefined) {
    throw new ApiError(400, " no video selected")
  }

  if (!videoTitle || !videoDes) {
    throw new ApiError(400, "video title or description is required")
  }


  let userChannelDetails = await User.findById(req.user._id)

  userChannelDetails = await userChannelDetails.populate("channel")
  
  // let channelName = userChannelDetails.channel.channelName
//  console.log("owner",channelName)

  let videoResponse = await cloduinaryVideoUpload(video);

  let videoDetails =
    await Video.create({
      title: videoTitle,
      owner: req.user._id,
      description: videoDes,
      videoFile: videoResponse?.secure_url,
      duration: videoResponse?.duration,
      uploadTime: new Date().toDateString(),
      ownerName: userChannelDetails.channel?.channelName,
      channelProfilePic:userChannelDetails.channel?.profilePic
    })

  let updateChannel = await Channel.findOneAndUpdate(userChannelDetails.channelName,{
    $push:{videos:videoDetails._id}
  },{new:true})

  return res.status(201).json(new ApiResponse(200, "successfully video uploaded", videoDetails))
})

export { handleVideoUpload } 