import multer from "multer"
import path from "path"
import { ApiError } from "../utils/ApiError.js";

let storage,imageUpload,videoUpload; 
 try {
  storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, "./uploads/images")
   },
   filename: function (req, file, cb) {
     cb(null, file.fieldname + '_' + new Date().getSeconds()
     + path.extname(file.originalname))
   }
 })
 
  imageUpload = multer({ storage })
 
 
 //upload videos 
 
 const videoStorage = multer.diskStorage({
   destination: "./uploads/videos",
   filename: (req, file, cb) => {
     cb(null, file.fieldname + '_' + new Date().getSeconds()
       + path.extname(file.originalname))
   }
 });
 
  videoUpload = multer({
   storage: videoStorage,
   limits: {
     fileSize: 90000000 
   },
   
   // fileFilter(req, file, cb) {
   //   console.log("file", file)
   //   // upload only mp4 and mkv format
   //   if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
   //     return cb(new Error('Please upload a video'))
   //   }
   //   cb(undefined, true) 
   // }
 })
 } catch (error) {
  throw new ApiError(500,error.message)
 }
export { imageUpload, videoUpload }