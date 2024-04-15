import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
const updatePassword = asyncHandler(async (req, res, next) => {

  const { currentPass, newPass, confirmPass } = req.body
  // console.log(currentPass,newPass,confirmPass)
  const findUser = await User.findById(req.user._id)
  let checkPass
  let passwordSaved
 
    if (!currentPass || !newPass || !confirmPass) {
  
      throw new ApiError(400, "every field is required")
    } else {
      checkPass = await findUser.isPasswordCorrect(currentPass)
    }
    if ( !checkPass ) throw new ApiError(400, "current password is not correct")
  
    if (newPass !== confirmPass) {
  
      throw new ApiError(400,"newPassword and confirm password are not matching")
    } if(currentPass === confirmPass){
      throw new ApiError(400,"current password and new passwords are must be different")
    } else{
      findUser.password = confirmPass
      passwordSaved = await findUser.save(
        {
          validateBeforeSave:false,
         }
      )
      passwordSaved = undefined
    }
 
 
  return  res.status(200).json( new ApiResponse(200,"password updated successfully"))
})


export {updatePassword}