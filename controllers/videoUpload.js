import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { cloduinaryVideoUpload } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import Channel from "../models/channel.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { VideoDetails } from "../models/video.details.js"
const handleVideoUpload = asyncHandler(async (req, res) => {

  // console.log(req.user.channel)
  if (req.user.channel == undefined) {
    throw new ApiError(400, "you don't have any channel.Please create a channel")
  }
  const thumbnail = req.files.thumbnail?.[0]?.path
  const video = req.files.video?.[0]?.path
// console.log(video,"video")
  const { videoTitle, videoDes } = req.body
  if (video == undefined || thumbnail == undefined) {
    throw new ApiError(400, "provide video and thumbnail")
  }

  if (!videoTitle || !videoDes) {
    throw new ApiError(400, "video title or description is required")
  }


  let userChannelDetails = await User.findById(req.user._id)

  userChannelDetails = await userChannelDetails.populate("channel")

  let thubnailResponse = await uploadOnCloudinary(thumbnail)
  // console.log("one",thubnailResponse)
  let videoResponse = await cloduinaryVideoUpload(video);
  // console.log("two",videoResponse)
  let videoDetails =
    await Video.create({
      title: videoTitle,
      owner: req.user._id,
      description: videoDes,
      thumbnail: thubnailResponse.secure_url || "",
      thumbnailCloudinaryId: thubnailResponse.public_id,
      videoFile: videoResponse?.secure_url,
      cloudinaryVideoId: videoResponse?.public_id,
      duration: videoResponse?.duration,
      uploadTime: new Date().toDateString(),
      ownerName: userChannelDetails.channel?.channelName,
      channelProfilePic: userChannelDetails.channel?.profilePic
    })

    const videoInteraction = await  VideoDetails.create({
      videoId:videoDetails._id
    })
 
    videoDetails.userInteractionWithVideos= videoInteraction._id
    await videoDetails.save()
    
  let updateChannel = await Channel.findOneAndUpdate(userChannelDetails.channelName, {
    $push: { videos: videoDetails._id },
    
  }, { new: true })

  return res.status(201).json(new ApiResponse(200, "successfully video uploaded", videoDetails))
})

export { handleVideoUpload } 