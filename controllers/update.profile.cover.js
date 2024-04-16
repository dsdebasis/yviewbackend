import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const getProfileAndCover = asyncHandler(async (req, res) => {
  try {
    const getExistedProfileAndCover = await User.findById(req.user._id, {
      profilePic: true, coverImage: true
    })

    let ipDetails = req.socket.remoteAddress
    //  console.log(req.socket)
    //  let ipTroughHeader = req.header("x-forwarded-for")
    // console.log(ipTroughHeader)
    res.status(200).json(new ApiResponse(200, "profile img and cover img fetched successfully", { getExistedProfileAndCover, ipDetails }))
    //  let updateDetails = await User.findByIdAndUpdate
  } catch (error) {
    throw new ApiError(500, "errror while fetching data ", error)
  }
})


const updateProfileAndCover = asyncHandler(async (req, res,) => {

  const updateProfilePicPath = req.files.updateProfilPic?.[0].path
  const updateCoverImagePath = req.files.updateCoverImage?.[0].path
  
    if (!updateProfilePicPath && !updateCoverImagePath) {

      throw new ApiError(400, "one of the filed is required", "error while getting files from the user")

    }

    let updateProfilPicRes, updateCoverImageRes;
    try {
      if(updateProfilePicPath) {
        updateProfilPicRes = await uploadOnCloudinary(updateProfilePicPath)
      } 
      if(updateCoverImagePath){
        updateCoverImageRes = await uploadOnCloudinary(updateCoverImagePath)
      }

      console.log(updateProfilPicRes || updateCoverImageRes)
    } catch (error) {
      throw new ApiError(400, "either of the filed is required", error)
    }
    let newProfileImgDetails
    try {
      newProfileImgDetails = await User.findOneAndUpdate(req.user.username, {
        $set: {
          profilePic: updateProfilPicRes.url,
          coverImage: updateCoverImageRes.url
        }
      }, {
        new: true
      })

    } catch (error) {
     throw new ApiError(500,"erroe while uploading images",error)
    }

    return res.status(200)
              .json(new ApiResponse(202, "successfully updated", newProfileImgDetails))

 
})
export { getProfileAndCover, updateProfileAndCover }