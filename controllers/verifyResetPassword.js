import { User } from "../models/user.model.js";
import PasswordResetLink from "../models/passLink.model.js"
import { sendMail } from "../utils/sendMail.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { isValidObjectId, set } from "mongoose";

const verifyPasswordResetEmail = asyncHandler(async(req,res,next)=>{

    const {passwordResetToken} = req.params;
    const {password,confirmPassword} = req.body;

    if(!passwordResetToken){
        throw new ApiError(400,"No Token found.")
    }

    const validToken = isValidObjectId(passwordResetToken)
    if(validToken == false){
        throw new ApiError(400,"Not a valid Token.")
    }
    if(!password || !confirmPassword){
        throw new ApiError(400,"Missing Password and ConfirmPassword.")
    }

    if(password !== confirmPassword){
        throw new ApiError(400,"Password and ConfirmPassword must be same.")
    }

    const checkToken = await PasswordResetLink.findById(passwordResetToken)
    // console.log("token",checkToken)
    if(!checkToken){
        throw new ApiError(400,"Token is Expired or invalid.")
    } else{
   
       try {
         let findUser = await User.findOne({email:checkToken.email})
 
        //  console.log(fidnUser)
          findUser.password = confirmPassword;
          let updatedUser = await findUser.save(
             {
               validateBeforeSave:false,
              }
           )

        await PasswordResetLink.findByIdAndDelete(passwordResetToken)

        return res.status(200).json(new ApiResponse(200,"Password Updated Successfully",{
            success:true
        }))   
       } catch (error) {
        throw new ApiError(500,error.message,error)
       }
    }
})

export default verifyPasswordResetEmail