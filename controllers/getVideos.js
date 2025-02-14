import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getVideos = asyncHandler(async (req, res, next) => {
  const { page, pageSize } = req.params;
  if(!page || !pageSize){
    throw new ApiError(400,"please provide page and pageSize")
  }
  let allVideos = await Video.find(
    {},
    {
      createdAt: false,
      updatedAt: false,
    }
  ).skip((page-1)*pageSize)
  .limit(8);

  if (allVideos.length == 0) {
    throw new ApiError(500, "No videos found");
  }
  // console.log(allVideos)
  res.set("Cache-Control", "public, max-age=300")
  return res
    .status(200)
    .json(
      new ApiResponse(200, "successfully fetched all the videos", allVideos)
    );
});

export default getVideos;
