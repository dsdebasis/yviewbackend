import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary,removeExistingFile } from "../utils/cloudinary.js"

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
  
  const updateProfilePicPath = req.files.updateProfilePic?.[0].path
  const updateCoverImagePath = req.files.updateCoverImage?.[0].path

  if ((updateProfilePicPath === undefined) && (updateCoverImagePath === undefined)) {
    throw new ApiError(400,"no image found .please select one ")
  } 
  // console.log("profile",updateProfilePicPath,"cover",updateCoverImagePath)

  let updateProfilePicRes, updateCoverImageRes,newProfileImgDetails
  try {

    //updating profile
    if (updateProfilePicPath === undefined) {
      console.log("no profile img found")
      // throw new ApiError(400,"no profile pic is selected")
    } else {
      //  console.log("prpid",req.user.prpicPubId)
       removeExistingFile(req.user.prpicPubId)
      
      updateProfilePicRes = await uploadOnCloudinary(updateProfilePicPath)
      
      // console.log("updateProPic res",updateProfilePicRes)
      newProfileImgDetails = await User.findOneAndUpdate({ username: req.user.username }, {
        $set: {
          profilePic: updateProfilePicRes.secure_url ,
          prpicPubId:updateProfilePicRes.public_id
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
      
      removeExistingFile(req.user.chnlPicPubId)

      updateCoverImageRes = await uploadOnCloudinary(updateCoverImagePath)
      // console.log("update cover  res",updateCoverImageRes.public_id)
      newProfileImgDetails = await User.findOneAndUpdate({ username: req.user.username }, {
        $set: {
          coverImage: updateCoverImageRes.secure_url,
          chnlPicPubId:updateCoverImageRes.public_id
        }
      },
        { 
        new: true
      }).select("profilePic coverImage")
  
    }
    return res.status(200).json(new ApiResponse(202,"successfully updated",newProfileImgDetails))

  } catch (error) {
    console.log(error)
    throw new ApiError(500, "error while updating profile and coverImage", error)
  }

})
export { getProfileAndCover, updateProfileAndCover }