import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"

import { sendMail } from "../utils/sendMail.js"
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/AsyncHandler.js"
import IP from "ip"
import { sendOtp } from "../utils/sendOtp.js"
import otpVerification from "./otpVerification.js"

const genAccessTokenAndRefreshToken = async function (userid) {
  try {
    const user = await User.findById(userid)
    const accessToken = user.genAccessToken()
    const refreshToken = user.genRefreshToken()

    user.refreshToken = refreshToken
    await user.save({
      validateBeforeSave: false
    })

    return { accessToken, refreshToken }
  } catch (error) {

    throw new ApiError(500, "error while creating tokens")
  }
}

let emailSubject, emailMessage

const registerUser = asyncHandler(async (req, res) => {

  let checkTempToken = req.cookies.account_Token || req.header("Authorization")?.replace("Bearer ", "")
  let checkVerifyToken

  if (checkTempToken) {
    checkVerifyToken = jwt.verify(checkTempToken, process.env.ACCESS_TOKEN_SECRET)
  }

  if (checkVerifyToken) {
    throw new ApiError(400, "already token generated. please verify it on verifyotp page")
  }
  const { fullname, email, username, password, confirmPassword } = req.body

  if (!fullname || !email || !username || !password || !confirmPassword) {

    throw new ApiError(400, "every field is requird")
  }

  let existedUser = await User.findOne({ email })
  if (existedUser) {
    throw new ApiError(400, "email id is already registered")
  }

  existedUser = await User.findOne({ username })
  if (existedUser) {
    throw new ApiError(400, "username is already existed")
  }
  if (password.length < 6) {
    throw new ApiError(400, "password must contain 6 characters long")
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, "password and confirm passwords are not matching")
  }


  function tempToken(fullname, email, username, confirmPassword) {

    return jwt.sign({
      name: fullname,
      email: email,
      username: username,
      password: confirmPassword
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m"
    })

  }

  let tempAccountToken = tempToken(fullname, email, username, confirmPassword)
  console.log(tempAccountToken)
  let otpDetails = await sendOtp(req, res)

  // const options = 
  return res.status(200)
    .cookie("tempAccountToken", tempAccountToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      expires: new Date(Date.now() + 60 * 60 * 1000)
    })
    .json(new ApiResponse(200, "Please Verify the email in verifyotp page", {
      tempAccountToken
    }))

})


const login = asyncHandler(async (req, res) => {

  const { username, password } = req.body

  if (!username || !password) {
    throw new ApiError(400, "every field is required")
  }

  const findUser = await User.findOne({ username })
  if (!findUser) {
    throw new ApiError(400, "no user found")
  }

  const checkPass = await findUser.isPasswordCorrect(password)

  if (!checkPass) {

    throw new ApiError(400, "password is wrong",)

  } else {

    if (findUser.activeDevice === 10) {
      throw new ApiError(400, "maximum 10 devices are allowed")
    }

    const { accessToken, refreshToken } = await genAccessTokenAndRefreshToken(findUser._id)

    const loggedinDevices = await User.findByIdAndUpdate(findUser._id, {
      $inc: { activeDevice: 1 }
    },
      { new: true })

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    }
    emailSubject = "new login"
    emailMessage = `a new device got logged in.Active device is  ${loggedinDevices.activeDevice}. IP address -${IP.address()} `

    try {
      await sendMail(findUser.email, emailSubject, emailMessage)

    } catch (error) {
      throw new ApiError(500, "error while sending mail", error)
    }
    return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, "Successfully Log In", { accessToken, refreshToken, activeDevice: loggedinDevices.activeDevice }))

  }
}


)
const logout = asyncHandler(async (req, res) => {
  const user = req.user

  console.log(user)
  const findUser = await User.findByIdAndUpdate(user?._id, {
    $inc: { activeDevice: -1 }, $set: { refreshToken: "" }
  })

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",

  }

  emailSubject = "logout"
  emailMessage = "you got logged out from a device"
  try {
    const mailDetails = await sendMail(findUser.email, emailSubject, emailMessage)
  } catch (error) {
    console.log(error)
    throw new ApiError(500, "error while sending mail", error)
  }
  let expireOption = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    expires: new Date(Date.now() )
  }
  return res.status(200)
    .clearCookie("accessToken",expireOption)
    .clearCookie("refreshToken", expireOption)
    .json(new ApiResponse(200, "successfully logout"))
})



export { registerUser, login, logout }