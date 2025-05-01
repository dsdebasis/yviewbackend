import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const getChannel = asyncHandler(async (req, res, next) => {
  // console.log(req.user._id)
  let userChannelDetails = await User.findById(req.user._id);
  let uploadedVideos;

  if (userChannelDetails.channel !== undefined) {
    try {
      userChannelDetails = await userChannelDetails.populate("channel");
      uploadedVideos = userChannelDetails;
      userChannelDetails = userChannelDetails.channel.toObject();
      
      console.log("userChannelDetails",typeof userChannelDetails)
      let allVideos = await Video.find(
        { owner: req.user._id },
        {
          createdAt: false,
          updatedAt: false,
          owner: false,
        }
      );

      let totalViews = await Video.aggregate([
        { $match: { owner: req.user._id } },
        { $group: { _id: "$owner", totalViews: { $sum: "$views" } } },
      ]);
      console.log(totalViews)
     if(totalViews.length !== 0){
      userChannelDetails.totalView = totalViews[0]?.totalViews || 0;
     }
      res.set("Cache-Control", "public, max-age=20");
      return res
        .status(200)
        .json(
          new ApiResponse(200, "successfully fetched channel details", {
            userChannelDetails,
            allVideos,
          })
        );
    } catch (error) {
      console.log(error);
      throw new ApiError(500, error?.message, error);
    }
  } else {
    throw new ApiError(400, "no channel found. Create a channel");
  }
});

export default getChannel;
