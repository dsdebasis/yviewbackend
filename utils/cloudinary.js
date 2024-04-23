
import fs from "fs"
import { ApiError } from "./ApiError.js";

import { v2 as cloudinary } from 'cloudinary';
import e from "express";
import { ApiResponse } from "./ApiResponse.js";

cloudinary.config({
  cloud_name: 'dkghyrkrq',
  api_key: '685495551614963',
  api_secret: 'zUfP5KBZYQwDSSlvsWfOWrKP-4I'
})

const uploadOnCloudinary = async function (localFilePath) {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true
  }

  try {
    if (!localFilePath) return "no localpath is found"
    const response = await cloudinary.uploader.upload(localFilePath, options)

    console.log("file upload successfully", response.public_id)
    fs.unlinkSync(localFilePath)

    return response
  } catch (error) {
    fs.unlinkSync(localFilePath)
    throw new ApiError(500, "error while uploading in cloudinary", error)
  }
}
const removeExistingFile = function (file) {
  cloudinary.uploader.destroy(file).then((res) => {

    return res
  }).catch((error) => {

    throw new ApiError(500, "error while deleting")
  })

}

export { uploadOnCloudinary, removeExistingFile }