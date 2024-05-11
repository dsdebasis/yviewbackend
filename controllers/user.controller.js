import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { sendMail } from "../utils/sendMail.js"
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/AsyncHandler.js"
import IP from "ip"
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
if(password.length < 6) {
  throw new ApiError(400,"password must contain 6 characters long")
}
  if (password !== confirmPassword) {
    throw new ApiError(400, "password and confirm passwords are not matching")
  }

  let profilePicLocalPath = req.files.profilePic?.[0].path
  let coverImageLocalPath = req.files.coverImage?.[0].path



  if (profilePicLocalPath == undefined) {
    throw new ApiError(400, "A profile pic is necessary")
  }

  const profilePicResponse = await uploadOnCloudinary(profilePicLocalPath)
  let coverImageResponse

  if (coverImageLocalPath !== undefined) {
    coverImageResponse = await uploadOnCloudinary(coverImageLocalPath)
  }


  if (profilePicResponse == undefined) {
    throw new ApiError(500, "error while uploading profile pic")
  }


  let newUser
  try {
    newUser =  await User.create({
      fullname, 
      email,
      username,
      password,
      profilePic: profilePicResponse?.secure_url,
      prpicPubId: profilePicResponse?.public_id,
      coverImage: coverImageResponse?.secure_url,
      chnlPicPubId: coverImageResponse?.public_id,
    })
  
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken")
  
    if (!createdUser) {
      throw new ApiError(500, "error while creating account")
    }
     emailSubject= `account created on https://yviewfrontend.vercel.app`
     emailMessage = `Successfully Account Created. Wellcome ${fullname} to our platform , where funs are just one step away. Thank You `
    

    try {
       await sendMail(createdUser.email, "account created in yviewfrontend.vercel.com", emailMessage)
   
    } catch (error) {
      throw new ApiError(500, "error while sending mail", error)
    }

    return res.status(200).json(new ApiResponse(201, "successfully account created", createdUser))
  } catch (error) {
   console.log("error while creating account", error)
  }
})


const login = asyncHandler(async (req, res) => {

  // const loginUser = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")

  // let parseClientCookie

  // if (req.cookies.auth_info !== undefined) {
  //   parseClientCookie =  JSON.parse(req.cookies.auth_info)
  // }
 
  const { username, password } = req.body


  // let verifyUser
  // if (loginUser) {

  //   verifyUser = jwt.verify(loginUser, process.env.ACCESS_TOKEN_SECRET)
  // }

 
  // if (parseClientCookie !== undefined) {
  //   if (verifyUser && parseClientCookie.status === true) {
  //     throw new ApiError(400, "already login")
  //   }
  // }

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

  const findUser = await User.findByIdAndUpdate(user._id, {
    $inc: { activeDevice: -1 }, $set: { refreshToken: "" }
  })

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",

  }
  
  emailSubject="logout"
  emailMessage="you got logged out from a device"
  try {
    const mailDetails = await sendMail(findUser.email, emailSubject, emailMessage)
  } catch (error) {
    throw new ApiError(500, "error while sending mail", error)
  }
  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "successfully logout"))


})



export { registerUser, login, logout }