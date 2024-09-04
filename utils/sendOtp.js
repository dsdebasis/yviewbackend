import crypto from "crypto";
import { asyncHandler } from "./AsyncHandler.js";
import { OTP } from "../models/otp.model.js";
import { sendMail } from "./sendMail.js";
import { ApiResponse } from "./ApiResponse.js";
import { ApiError } from "./ApiError.js";

const generateOtp = () => {
  let otp = crypto.randomInt(100000, 999999).toString();
  return otp;
};

const sendOtp = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ApiError(400, "provide Email");
    }
    let findOtp = await OTP.findOne({ email: email });

    if (findOtp == null) {
      let otp = generateOtp();

      let newOtp = await OTP.create({
        email: email,
        otp: otp,
      });
      let message = `your one time otp for email verification is ${newOtp.otp} . valid ony 15 minitues.`;
      let subject = "Email Verification";
    
        let emailSent = await sendMail(email, subject, message);

        return {
          success: true,
          message: "OTP Send Successfully",
        };
     
    } else {
      return {
        success:false,
        message:"OTP is already generated"
      }
    }
  } catch (error) {

    throw new ApiError(500,error.message,error)
  }
});

let verifyOtp = async function (email, otp) {
  if(!email || !otp){
    throw new ApiError(400,"Email and otp is required")
  }
  let checkOtp = await OTP.findOne({ email: email });

  // console.log("chekOtp response",checkOtp) 
  
  if (checkOtp == null || undefined) {
    return {
      code:false,
      message:"No Email with OTP found"
    }
  }

  if(checkOtp.otp !== otp){
    console.log("checkOtp",checkOtp.otp ,otp)
   
    return {
      success:false,
      message:"Invalid OTP"
    }
  }
  if (checkOtp?.otp === otp) {
    await OTP.findOneAndDelete(email);
   
    return {
      success:true,
      message:"OTP Validated"
    }
  }  
};
export { sendOtp, verifyOtp };
