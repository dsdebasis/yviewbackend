import { Router } from "express"
import { registerUser, login, logout } from "../controllers/user.controller.js"
import { authenticate } from "../middlewares/auth.mwire.js"
import { upload } from "../middlewares/multer.mwire.js"
import { getProfile, updateProfile } from "../controllers/profile.js"

import { updatePassword } from "../controllers/updatePassword.js"
import { getProfileAndCover, updateProfileAndCover }
      from "../controllers/update.profile.cover.js"
import createChannel from "../controllers/createChannel.js"
import delteAccount from "../controllers/deleteAccount.js"
import getChannel from "../controllers/getChannel.js"

const router = Router()
router.route("/register")
      .post(upload.fields([
            {
                  name: "profilePic", maxCount: 1
            },
            {
                  name: "coverImage", maxCount: 1
            }
      ]), registerUser)

router.route("/login").post(login)

router.route("/logout").post(authenticate, logout)

router.route("/profile")
      .get(authenticate, getProfile)
      .put(authenticate, updateProfile)

router.route("/updatepassword").put(authenticate, updatePassword)

router.route("/updateprofileandcover")
      .get(authenticate, getProfileAndCover)
      .put(authenticate, upload.fields(
            [
                  { name: "updateProfilePic", maxCount: 1 },
                  { name: "updateCoverImage", maxCount: 1 }
            ]
      ), updateProfileAndCover)

router.route("/createchannel").post(authenticate,upload.single("profilePic"), createChannel)      
router.route("/getchannel").get(authenticate,getChannel) 
router.route("/deleteaccount").post(authenticate,delteAccount)

export default router 