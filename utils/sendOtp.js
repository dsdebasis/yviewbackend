import crypto from "crypto"
import { asyncHandler } from "./AsyncHandler.js"
import { OTP } from "../models/otp.model.js"
import { sendMail } from "./sendMail.js"
import { ApiResponse } from "./ApiResponse.js"
import { ApiError } from "./ApiError.js"

const generateOtp = () => {
  let otp = crypto.randomInt(100000, 999999).toString()
  return otp
}
const sendOtp = asyncHandler(async (req, res, next) => {

  const { email } = req.body
  if (!email) {
    throw new ApiError(400, "provide Email")
  }
  let findOtp = await OTP.findOne({ email: email })


  if (findOtp == null) {
    let otp = generateOtp()

    let newOtp = await OTP.create({
      email: email,
      otp: otp
    })
    let message = `your one time otp for email verification is ${newOtp.otp} . valid ony 5 minitues.`
    let subject = "Email Verification"
    let emailSent = await sendMail(email,subject , message)
    return {
      message: "OTP Send Successfully"
    }

  } else {
    throw new ApiError(400, "otp is already generated")
  }

})

let verifyOtp = async function (email, otp) {

  let checkOtp = await OTP.findOne({ email: email })

  if (!checkOtp) {
    return -1
  }
  if (checkOtp.otp === otp) {
    await OTP.findOneAndDelete(email)
    return true
  } else {
    return false
  } 
}
export { sendOtp, verifyOtp } 