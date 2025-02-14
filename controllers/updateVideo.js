import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import Channel from "../models/channel.model.js";
import { checkMongoDbId } from "../utils/checkMongoId.js";
import { imageUpload } from "../middlewares/multer.mwire.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const updateVideos = asyncHandler(async (req, res) => {
  //first check login or not

  const checkChannel = await Channel.findOne({ owner: req?.user?._id });
  if (!checkChannel) {
    throw new ApiError(400, "you don't have any channel");
  }

  if (!checkMongoDbId(req.params.vid)) {
    throw new ApiError(
      400,
      "not a valid id",
      "please provide a valid video id"
    );
  }
    //finding the video by using id
    const findVideo = await Video.find({
      $and: [{ _id: req.params.vid }, { owner: req?.user._id }],
    });

    if (!findVideo || findVideo.length == 0) {
      throw new ApiError(400, "video not found ");
    }

    const videoThumbnailToUpdate = req.file?.path;

    let thubnailResponse;
    // console.log(videoThumbnailToUpdate,"videoThumbnailToUpdate")

    if (!req.body.title && !req.body.description) {
      throw new ApiError(400, "provide title or description");
    }
    if (videoThumbnailToUpdate !== undefined) {
      thubnailResponse = await uploadOnCloudinary(videoThumbnailToUpdate);
    }
    if (req.body.title || req.body.description) {
      const updateVideoInfo = req.body;

      const videoDetailaToUpdate = {
        title: updateVideoInfo?.title || findVideo[0].title,
        description: updateVideoInfo?.description || findVideo[0].description,
        thumbnail: thubnailResponse?.secure_url || findVideo[0].thumbnail,
      };

      const updateVideo = await Video.findOneAndUpdate(
        { _id: req.params.vid },
        { $set: videoDetailaToUpdate },
        { new: true }
      );

      return res.status(201).json(new ApiResponse(200, "video updated", updateVideo))
    }
  
});

export default updateVideos;
