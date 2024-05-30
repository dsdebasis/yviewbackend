import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Channel from "../models/channel.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createChannel = asyncHandler(async (req, res, next) => {

  const { channelName, about } = req.body
  const profilePic = req.file?.path

  if (!channelName || !about) {
    throw new ApiError(400, "every field is required")
  }

  const findChannel = await User.findById(req.user._id).populate("channel")

  if (req.user.channel !== undefined  ) {
    // console.log(findChannel)
    throw new ApiError(400, "user has already a channel")
  }
 
  let profilePicRes
  if (profilePic !== undefined) {
    profilePicRes = await uploadOnCloudinary(profilePic)
  }
 

  const newChannel = await Channel.create({
    owner: req.user._id,
    channelName,
    about,
    profilePic: profilePicRes?.secure_url || undefined,
    profilePicPubId: profilePicRes?.public_id || undefined,
    createdAt: new Date().toLocaleDateString()
  })

   await User.findByIdAndUpdate(findChannel._id,{
    $set:{channel:newChannel._id}
   },{
    new:true
   })


  return res.status(201).json(new ApiResponse(200, "successfully channel created", newChannel))
})

export default createChannel
