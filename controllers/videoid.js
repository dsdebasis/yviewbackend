import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { checkMongoDbId } from "../utils/checkMongoId.js";
import Comment from "../models/comments.js";

const getVideoLink = asyncHandler(async (req, res) => {
  let videoId = req.params.vid;

  if (videoId == undefined || null) {
    throw new ApiError(400, "no id found");
  }

  let mongoidCheck = checkMongoDbId(videoId);
  if (mongoidCheck !== true) {
    throw new ApiError(400, "Invalid dbId");
  }

  let videoLink = await Video.findOne(
    { _id: videoId },
    {
      cloudinaryVideoId: false,
      thumbnailCloudinaryId: false,
      owner: false,
      createdAt: false,
      updatedAt: false,
      isPublised: false,
    }
  );
  videoLink = videoLink.toObject()
  let totalComments = await Comment.countDocuments({ videoId: videoId });
  videoLink.totalComments = totalComments

  // console.log("vid", videoLink);
  if (!videoLink) {
    throw new ApiError(400, "invalid video id");
  }
  res.set("Cache-Control", "public, max-age=600")
  return res.status(200).json(new ApiResponse(200, videoLink));
});

export { getVideoLink };
