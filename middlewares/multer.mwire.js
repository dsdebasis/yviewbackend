import multer from "multer"
import path from "path"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/images")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + new Date.getSeconds() + file.extname)
  }
})

const imageUpload = multer({ storage })


//upload videos 

const videoStorage = multer.diskStorage({
  destination: "./uploads/videos",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + new Date().getSeconds()
      + path.extname(file.originalname))
  }
});

const videoUpload = multer({
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
export { imageUpload, videoUpload }