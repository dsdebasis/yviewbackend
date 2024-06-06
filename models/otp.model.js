import mongoose from "mongoose";
import { sendMail } from "../utils/sendMail.js";
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  }
})



export const OTP  = mongoose.model("OTP",otpSchema)