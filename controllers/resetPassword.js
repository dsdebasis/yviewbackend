import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { asyncHandler } from "../utils/AsyncHandler.js";
import { sendOtp } from "../utils/sendOtp.js";

const passwordReset = asyncHandler(async (req,res,next)=>{

      const {username,email} = req.body

      if(!username || !email){
        throw new ApiError(400,"userid and email is required")
      }

      const finduserById = await User.findOne({username,email})

      
      if(!finduserById){
       throw new ApiError(400,"userid or email is invalid")
      }

      let sendOtpToUser;
      try {
         sendOtpToUser = await sendOtp(req,res,next) 

         console.log(sendOtpToUser)

         if(sendOtpToUser?.success){
            return res.status(200).json(new ApiResponse(200,sendOtpToUser.message))
         } else{
            throw new ApiError(400,sendOtpToUser?.message)
         }
      } catch (error) {
        throw new ApiError(500,error.message,error)
      }
       
      
})

export default passwordReset;