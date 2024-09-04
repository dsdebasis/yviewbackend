import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { verifyOtp } from "../utils/sendOtp.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail.js";

const createUser = asyncHandler(async (req, res, next) => {
 
    const { email, otp } = req.body;

    let veriFyOtp = await verifyOtp(email, otp);
    

    if (veriFyOtp?.code == false) {
      throw new ApiError(400, "No email with OTP found");
    }

    if(veriFyOtp?.success == false){
      throw new ApiError(400,veriFyOtp?.message)
    }
    if (veriFyOtp?.success) {
      let tempToken =
        req.cookies.tempAccountToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      let verifyToken = jwt.verify(tempToken, process.env.ACCESS_TOKEN_SECRET);

      let { name, email, username, password } = verifyToken;

      let newUser = await User.create({
        fullname: name,
        email: email,
        username: username,
        password: password,
      });

      const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken "
      );

      if (!createdUser) {
        throw new ApiError(500, "error while creating account");
      }

      let emailSubject = `account created on yview`;
      let emailMessage = `Successfully Account Created. Wellcome ${createdUser.fullname} to our platform , where funs are just one step away.login to
        https://yview.vercel.app Thank You `;

      await sendMail(createdUser.email, emailSubject, emailMessage);

      return res
        .status(200)
        .clearCookie("tempAccountToken", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
        })
        .json(
          new ApiResponse(
            201,
            "successfully account created Please login",
            createdUser
          )
        );
    }
   
 
});

export default createUser;
