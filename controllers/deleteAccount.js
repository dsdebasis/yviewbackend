import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import Channel from "../models/channel.model.js"
import { removeExistingFile } from "../utils/cloudinary.js"
import {Video} from "../models/video.model.js"
const delteAccount = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new ApiError(400, "every field is required")
  }
  if (req.user.email !== email) {
    throw new ApiError(400, "wrong email address")
  }

  // console.log(await req.user.isPasswordCorrect())

  let user = await User.findById(req.user._id)
  let checkPass = await user.isPasswordCorrect(password)
 
  if (checkPass !== true){
    throw new ApiError(400,"wrong password")
  }
   
  let deletedChannel
  console.log(req.user.channel)
  if (req.user.channel !== undefined) {

    let deleteVideos =await Video.deleteMany({owner:req.user._id})
    console.log("delete video",deleteVideos)
    deletedChannel = await Channel.findByIdAndDelete(req.user.channel)
  } else {
    console.log("user has no channel")
  }


  if (req.user.prpicPubId !== undefined) {
    removeExistingFile(req.user.prpicPubId)
  }
  if (req.user.chnlPicPubId !== undefined) {
    removeExistingFile(req.user.chnlPicPubId)
  }

  const deletedUser = await User.findByIdAndDelete(req.user._id)

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
}
  return res.status(200)
         .clearCookie("accessToken",options)
         .clearCookie("refreshToken",options)
         .json(new ApiResponse(200, " account  deleted successfully"))
})

export default delteAccount;