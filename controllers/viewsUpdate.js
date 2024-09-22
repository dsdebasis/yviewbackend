import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Video as videoModel } from "../models/video.model.js";
import { checkMongoDbId } from "../utils/checkMongoId.js";


const updateViews = asyncHandler(async (req, res) => {
  let videoId = req.params.vid;

  if (!videoId) throw new ApiError(400, "please provide video id");

  if (!checkMongoDbId(videoId))
    throw new ApiError(400, "please provide valid video id");

  let findVideos = await videoModel.findOne({_id:videoId});


  if (findVideos) {
    const updateViews = await videoModel.findOneAndUpdate(
      {
        _id: videoId,
      },
      { $inc: { views: 1 } },
      {
        returnDocument: "after",
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, "views updated", updateViews));
  } else {
    
    throw new ApiError(400,"Invalid Video Id")
  }
});

export default updateViews;
