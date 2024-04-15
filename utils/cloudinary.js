
import fs from "fs"


import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dkghyrkrq', 
  api_key: '685495551614963', 
  api_secret: 'zUfP5KBZYQwDSSlvsWfOWrKP-4I' 
}); 
const uploadOnCloudinary = async function (localFilePath) {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true
  }

  try {
    if (!localFilePath) return "no localpath is found"
    const response = await cloudinary.uploader.upload(localFilePath, options)

    console.log("file upload successfully")
    fs.unlinkSync(localFilePath)

    return response
  } catch (error) {
    fs.unlinkSync(localFilePath)
    return "error while uploading in cloudinary"
  }
}
 

export {uploadOnCloudinary}