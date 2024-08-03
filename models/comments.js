import mongoose from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required:[true,"A comment is must"],
    
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required:[true,"a videoId is must"]
  },
  commentTime: {
    type:String
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:[true,"A owener id is must"]
  },
  userPic:{
    type:String,

  }
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
