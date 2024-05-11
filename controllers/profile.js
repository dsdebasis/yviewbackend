import { asyncHandler } from "../utils/AsyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"

const getProfile = asyncHandler(async (req, res,) => {
  const loginUser = await User.findById(req.user._id).select("-password -refreshToken -activeDevice -watchHistory ")
  //  console.log(loginUser)
  return res.status(200).json(new ApiResponse(200, "profile details fetched successfully", loginUser))

})

const updateProfile = asyncHandler(async (req, res) => {

  const { updateFullname, updateEmail, updateUsername } = req.body

  // console.log(updateFullname, updateEmail, updateUsername)

  let updateDetails

  if (!updateFullname && !updateEmail && !updateUsername) {
    throw new ApiError(400,"no field is selected")
  }
  if (updateFullname || updateEmail || updateUsername) {

    updateDetails = await User.findByIdAndUpdate(req.user._id, {
      $set: {
        fullname: updateFullname || req.user.fullname,
        email: updateEmail || req.user.email,
        username: updateUsername || req.user.username
      }
    }, { 
      new: true
    },).select("-password -refreshToken  -activeDevice")

    return res.status(200).json(new ApiResponse(202, "profile updated", updateDetails))
  }
})
export { getProfile, updateProfile }