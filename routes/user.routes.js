import { Router } from "express";
import { registerUser, login, logout } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.mwire.js";
import { imageUpload, videoUpload } from "../middlewares/multer.mwire.js";
import { getProfile, updateProfile } from "../controllers/profile.js";

import { updatePassword } from "../controllers/updatePassword.js";
import {
  getProfileAndCover,
  updateProfileAndCover,
} from "../controllers/update.profile.cover.js";
import createChannel from "../controllers/createChannel.js";
import deleteAccount from "../controllers/deleteAccount.js";
import getChannel from "../controllers/getChannel.js";
import { handleVideoUpload } from "../controllers/videoUpload.js";
import getVideos from "../controllers/getVideos.js";
import createUser from "../controllers/createUser.js";
import { sendOtp } from "../utils/sendOtp.js";
import { getVideoLink } from "../controllers/videoid.js";
import {
  editComments,
  getComments,
  makeComments,
  removeComments,
} from "../controllers/getComment.js";

import passwordResetEmail from "../controllers/resetPassword.js";
import verifyPasswordResetEmail from "../controllers/verifyResetPassword.js";
const router = Router();

router.route("/register")
      .post(imageUpload.single("profilePic"), registerUser);

router.route("/create-user")
      .post(createUser);
router.route("/login")
      .post(login);

router.route("/logout")
      .post(authenticate, logout);

router.route("/password-reset-email")
      .post(passwordResetEmail);

router.route("/password-resetemail-verify/:passwordResetToken")
      .post(verifyPasswordResetEmail)

router.route("/profile")
      .get(authenticate, getProfile)
      .put(authenticate, updateProfile);

router.route("/updatepassword")
      .put(authenticate, updatePassword);

router.route("/updateprofileandcover")
      .get(authenticate, getProfileAndCover)
      .put(authenticate,
            imageUpload.fields([
                  { name: "updateProfilePic", maxCount: 1 },
                  { name: "updateCoverImage", maxCount: 1 },
            ]),
    updateProfileAndCover
  );

router.route("/createchannel")
      .post(authenticate, imageUpload.single("profilePic"), createChannel);

router.route("/uploadvideo")
      .post(authenticate,
            videoUpload.fields([{ name: "thumbnail" }, { name: "video" }]),
            handleVideoUpload);

router.route("/getchannel")
      .get(authenticate, getChannel);

router.route("/getvideos/:page/:pageSize")
      .get(getVideos);

router.route("/videoid/:vid")
      .get(getVideoLink);

router.route("/deleteaccount")
      .delete(authenticate, deleteAccount);

router.route("/getotp")
      .post(sendOtp);


router.route("/comments/:videoId/:page/:pageSize")
      .get(getComments);

router.route("/comments/:videoId")
      .post(authenticate, makeComments);

router.route("/comments/:commentId")
      .patch(authenticate, editComments)
      .delete(authenticate, removeComments);

export default router;
