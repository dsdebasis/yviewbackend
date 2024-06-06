import { Router } from "express"
import { registerUser, login, logout } from "../controllers/user.controller.js"
import { authenticate } from "../middlewares/auth.mwire.js"
import { imageUpload,videoUpload } from "../middlewares/multer.mwire.js"
import { getProfile, updateProfile } from "../controllers/profile.js"

import { updatePassword } from "../controllers/updatePassword.js"
import { getProfileAndCover, updateProfileAndCover }
      from "../controllers/update.profile.cover.js"
import createChannel from "../controllers/createChannel.js"
import delteAccount from "../controllers/deleteAccount.js"
import getChannel from "../controllers/getChannel.js"
import { handleVideoUpload } from "../controllers/videoUpload.js"
import getVideos from "../controllers/getVideos.js"
import otpVerification from "../controllers/otpVerification.js"
import { sendOtp } from "../utils/sendOtp.js"

const router = Router()


router.route("/register")
      .post(imageUpload.single("profilePic"),registerUser)      

router.route("/login")
      .post(login)

router.route("/logout")
      .post(authenticate, logout)

router.route("/profile")
      .get(authenticate, getProfile)
      .put(authenticate, updateProfile)

router.route("/updatepassword").put(authenticate, updatePassword)

router.route("/updateprofileandcover")
      .get(authenticate, getProfileAndCover)
      .put(authenticate, imageUpload.fields(
            [
                  { name: "updateProfilePic", maxCount: 1 },
                  { name: "updateCoverImage", maxCount: 1 }
            ]
      ), updateProfileAndCover)

router.route("/createchannel")
      .post(authenticate,imageUpload.single("profilePic"), createChannel)      

router.route("/uploadvideo")
      .post(authenticate, videoUpload.fields([{name:"thumbnail"},{name:"video"}]),handleVideoUpload)

router.route("/getchannel")
      .get(authenticate,getChannel) 

router.route("/getvideos")
      .get(getVideos)

router.route("/deleteaccount")
      .delete(authenticate,delteAccount)

router.route("/getotp")
      .post(sendOtp)

router.route("/verifyotp")
      .post(otpVerification)

export default router 