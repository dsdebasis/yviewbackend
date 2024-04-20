import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    required: [true, "a fullname is required"]
  },
  email: {
    type: String,
    required: [true, "a email is required"],
    trim: true,
    lowercase: true,
    unique: true,

  },
  username: {
    type: String,
    required: [true, "a username is required"],
    trim: true,
    lowercase: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: [true, "a password is required"]
  },
  profilePic: {
    type: String,
    required: [true, "A profile pic is required"]
  },
  coverImage: {
    type: String
  },
  activeDevice: {
    type: Number,
    default:0,
    min: 0,
    max: [10, "maxium 10 device is allowed"]
  },
  refreshToken: {
    type: String
  },
  watchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video"
    }
  ]


}, { timestamps: true })


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})


userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}


userSchema.methods.genAccessToken =  function () {
  return jwt.sign({
    _id: this._id, email: this.email, username: this.username
  },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.genRefreshToken =  function () {

  return jwt.sign({
    _id: this._id,
  },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User", userSchema)