import { asyncHandler } from "../utils/AsyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { checkMongoDbId } from "../utils/checkMongoId.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { removeExistingFile } from "../utils/cloudinary.js";
const removeVideo = asyncHandler(async (req, res) => {
  const { vid } = req.params;

  if (!vid) {
    throw new ApiError(400, "Please provide vid");
  }

  if (!checkMongoDbId(vid)) {
    throw new ApiError(400, "Invalid vid");
  }
  const findVideo = await Video.find({ _id: vid, owner: req.user._id });

  if (!findVideo || findVideo.length == 0) {
    throw new ApiError(400, "Video not found");
  }


  let removeVideoFromCloudinary =  removeExistingFile(findVideo?.cloudinaryVideoId);
  console.log(removeVideoFromCloudinary)
  let deletedVideo;
  try {
    deletedVideo = await Video.findByIdAndDelete(vid);
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while deleting video",
      error.message
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Video Deleted", deletedVideo));
});

export default removeVideo;
