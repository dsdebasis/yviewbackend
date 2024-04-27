import fs from "fs"
import { ApiError } from "./ApiError.js";
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
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

    // console.log("file upload successfully", response.public_id)
    fs.unlinkSync(localFilePath)

    return response
  } catch (error) {
    fs.unlinkSync(localFilePath)
    console.log(error.message)
    throw new ApiError(500, "error while uploading in cloudinary", error)
  }
}
const removeExistingFile = function (file) {
  cloudinary.uploader.destroy(file,{
    invalidate:true
  }).then((res) => {

    return res
  }).catch((error) => {
    console.log("error while deteting", error)
    throw new ApiError(500, "error while deleting")
  })

}

export { uploadOnCloudinary, removeExistingFile }