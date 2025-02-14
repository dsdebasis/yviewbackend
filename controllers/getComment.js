import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { asyncHandler } from "../utils/AsyncHandler.js";
import Comment from "../models/comments.js";
import { checkMongoDbId } from "../utils/checkMongoId.js";
import { VideoDetails } from "../models/video.details.js";
import { Video } from "../models/video.model.js";

const getComments = asyncHandler(async (req, res) => {
  const { page, pageSize, videoId } = req.params;
  if (!page || !pageSize || !videoId) {
    throw new ApiError(400, "please provide all the details");
  }

  if (!checkMongoDbId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }
  let skipNum = (page - 1) * pageSize;
  let comments;
  try {
    comments = await Comment.find({ videoId }).skip(skipNum).limit(pageSize);
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "something went wrong", error.message);
  }
  res.set('Cache-Control', 'public, max-age=180')
  return res.status(200).json(
    new ApiResponse(200, {
      success: true,
      message: "successfully comments fetched",
      comments,
    })
  );
});

const makeComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const { _id, userPic,username } = req.user;

  const { comment } = req.body;

  if (!videoId || !_id) {
    throw new ApiError(400, "Please provide videoId and userId");
  }

  if (!checkMongoDbId(videoId) || !checkMongoDbId(_id)) {
    throw new ApiError(400, "please provide valid videoId and userId");
  }
  if (!comment) {
    throw new ApiError(400, "Please provide a comment");
  }
  let newComment;
  try {
    newComment = await Comment.create({
      videoId,
      owner: _id,
      userPic: userPic || null,
      commentTime: new Date().toDateString(),
      comment,
      username
    });
  } catch (error) {
    throw new ApiError(
      500,
      "Error while creating comment in db",
      error.message
    );
  }

  let VideoDetailsUpdate;
  try {
    VideoDetailsUpdate = await VideoDetails.findByIdAndUpdate(
      videoId,
      {
        $push: { comments: newComment },
      },
      {
        new: true,
      }
    );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went  wrong while updating video details",
      error.message
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "Comment Created", newComment));
});

const editComments = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  if (!commentId) {
    throw new ApiError(400, "Please provide comment id");
  }

  if (!checkMongoDbId(commentId)) {
    throw new ApiError(400, "Invalid comment Id");
  }

  if (!comment) {
    throw new ApiError(400, "Please provide the comment");
  }

  let findComments;
  
  try {
    findComments = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: { comment: comment },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Comment Updated", findComments));
  } catch (error) {
    throw new ApiError(500, "Error while Updating the comment", error.message);
  }
});

const removeComments = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "Missing comment id");
  }

  if (!checkMongoDbId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }
  try {
    await Comment.findByIdAndDelete(commentId);
  } catch (error) {
    throw new ApiError(500, "Error while deleting comment", error.message);
  }

  return res.status(200).json(new ApiResponse(204,"Comment Removed",{
    success:true
  }))
});

export { getComments, makeComments, editComments,removeComments };
