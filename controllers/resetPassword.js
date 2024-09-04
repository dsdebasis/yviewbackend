import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { asyncHandler } from "../utils/AsyncHandler.js";
import { sendOtp } from "../utils/sendOtp.js";
import { verifyOtp } from "../utils/sendOtp.js";
import { sendMail } from "../utils/sendMail.js";
import { PasswordResetLink } from "../models/PassLink.model.js";

const passwordResetEmail = asyncHandler(async (req, res, next) => {
  const { username, email } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "userid and email is required");
  }

  const finduserByUserNameEmail = await User.findOne({ username, email });

  if (!finduserByUserNameEmail) {
    throw new ApiError(400, "userid or email is invalid");
  }

  try {
    const existingLink = await PasswordResetLink.findOne({ email });

    if (!existingLink) {
      let resetPasswordLink = await PasswordResetLink.create({
        username: finduserByUserNameEmail?.username,
        email: email,
      });

      const emailMessage = "Link to reset your password"
      const link = `<a href="http://localhost:7000/api/v1/users/password-resetemail-verify/${resetPasswordLink?._id}">Click on the link to reset your password. Link will get expire in 5 Minitues.</a>`;

      await sendMail(email, "Reset Password",emailMessage,link );

      return res
        .status(200)
        .json(new ApiResponse(200, "Password reset Email sent."));
    } else{
      throw new ApiError(400,"Password reset Email is already sent.Kindly check your email.")
    }
  } catch (error) {
    throw new ApiError(500, error.message, error);
  }
});

export default passwordResetEmail;
