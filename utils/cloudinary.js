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
  cloudinary.uploader.destroy(file, {
    invalidate: true
  }).then((res) => {

    return res
  }).catch((error) => {
    console.log("error while deteting", error)
    throw new ApiError(500, "error while deleting")
  })

}

const cloduinaryVideoUpload = async function (localfile) {
  let result, error;
  try {
    if (!localfile) return "no file found to uplaod"

    result = await cloudinary.uploader.upload(file,
      {
        resource_type: "video",
        // public_id: "myfolder/mysubfolder/dog_closeup",
        // eager: [
        //   { width: 300, height: 300, crop: "pad", audio_codec: "none" },
        //   { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }],
        // eager_async: true,
        // eager_notification_url: "https://mysite.example.com/notify_endpoint"
      })
      fs.unlinkSync(localfile)
  } catch (error) {
    fs.unlinkSync(localfile)
    error = error
  }


  return result || error
}

export { uploadOnCloudinary, removeExistingFile, cloduinaryVideoUpload }