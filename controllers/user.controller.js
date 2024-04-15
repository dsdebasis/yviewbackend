import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { sendMail } from "../utils/sendMail.js"
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/AsyncHandler.js"
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

  if (password !== confirmPassword) throw new ApiError(400, "password and confirm passwords are not matching")
  const profilePicLocalPath = req.files.profilePic?.[0].path


  const coverImageLocalPath = req.files.coverImage?.[0].path
  console.log("profile")
  console.log(profilePicLocalPath)
  if (!profilePicLocalPath) {
    throw new ApiError(400, "A profile pic is necessary")
  }

  const prfoilePicResponse = await uploadOnCloudinary(profilePicLocalPath)
  const coverImageResponse = await uploadOnCloudinary(coverImageLocalPath)

  if (!prfoilePicResponse) throw new ApiError(500, "error while uploading")
  console.log("proflepicDetails",prfoilePicResponse)
  console.log("coverPicDetails",coverImageResponse)
  const newUser = await User.create({
    fullname: fullname,
    email: email,
    username: username,
    password: password,
    profilePic: prfoilePicResponse.url,
    coverImage: coverImageResponse.url
  })

  const createdUser = await User.findById(newUser._id).select("-password -refreshToken")

  if (!createdUser) {
    throw new ApiError(500, "error whie creating account")
  }

  return res.status(200).json(new ApiResponse(201,"successfully account created", createdUser))
})


const login = asyncHandler(async (req, res) => {

  const loginUser = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")

  const { username, password } = req.body


  let verifyUser
  if (loginUser) {

    verifyUser = jwt.verify(loginUser, process.env.ACCESS_TOKEN_SECRET)
  }

  if (verifyUser) {
    throw new ApiError(400, "already login")
  }

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

    if (findUser.activeDevice === 2) {
      throw new ApiError(400, "maximum 2 devices are allowed")
    } else {

      const { accessToken, refreshToken } = await genAccessTokenAndRefreshToken(findUser._id)

      const loggedinDevices = await User.findByIdAndUpdate(findUser._id, {
        $inc: { activeDevice: 1 }
      },
        { new: true })


      // emailSubject = "new login"
      // emailMessage = `a new device got logged in.Active device is  ${loggedinDevices.activeDevice}`

      // const mailDetails = await sendMail(findUser.email, emailSubject, emailMessage)
      const options = {
        httpOnly: true,
        secure: true,

      }
      return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, "Successfully Log In", { accessToken, refreshToken, activeDevice: loggedinDevices.activeDevice }))
    }
  }
}

)
const logout = asyncHandler(async (req, res) => {
  const user = req.user
  // console.log(user, "ds")
  const findUser = await User.findByIdAndUpdate(user._id, {
    $inc: { activeDevice: -1 }, $set: { refreshToken: "undefined" }
  })

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "successfully logout"))

})



export { registerUser, login, logout }