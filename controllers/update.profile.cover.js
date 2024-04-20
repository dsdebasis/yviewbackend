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
    return res.status(200).json(new ApiResponse(200, "profile img and cover img fetched successfully", getExistedProfileAndCover))

  } catch (error) {
    throw new ApiError(500, "errror while fetching data ", error)
  }
})

const updateProfileAndCover = asyncHandler(async (req, res,) => {
  if (req.files === undefined) {
    throw new ApiError(400,"no image found .please select one ")
  } 
  const updateProfilePicPath = req.files.updateProfilePic?.[0].path
  const updateCoverImagePath = req.files.updateCoverImage?.[0].path

  // console.log("profile",updateProfilePicPath,"cover",updateCoverImagePath)

  let updateProfilePicRes, updateCoverImageRes,newProfileImgDetails
  try {

    //updating profile
    if (updateProfilePicPath === undefined) {
      console.log("no profile img found")
      // throw new ApiError(400,"no profile pic is selected")
    } else {
      updateProfilePicRes = await uploadOnCloudinary(updateProfilePicPath)
      newProfileImgDetails = await User.findOneAndUpdate({ username: req.user.username }, {
        $set: {
          profilePic: updateProfilePicRes.url 
        }
      },
        { 
        new: true
      }).select("profilePic coverImage")

    }
    //updating coverImage
    if (updateCoverImagePath === undefined) {
      console.log("no cover image updated")
      // throw new ApiError(400,"no coverimage is provided")
    } else {
      updateCoverImageRes = await uploadOnCloudinary(updateCoverImagePath)
      newProfileImgDetails = await User.findOneAndUpdate({ username: req.user.username }, {
        $set: {
          coverImage: updateCoverImageRes.url 
        }
      },
        { 
        new: true
      }).select("profilePic coverImage")
  
    }
    return res.status(200).json(new ApiResponse(202,"successfully updated",newProfileImgDetails))

  } catch (error) {
    throw new ApiError(500, "error while updating profile and coverImage", error)
  }


})
export { getProfileAndCover, updateProfileAndCover }