import mongoose from "mongoose"

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const vidoeDetailsSchema = new mongoose.Schema({
  videoId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"Video",
   required:[true,"videoid is must "]
  },
  views:{
    type:Number,
    default:0
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  dislikes:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  comments:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Comment"
  }]
})

vidoeDetailsSchema.plugin(mongooseAggregatePaginate)

export const VideoDetails = mongoose.model("VideoDetails",vidoeDetailsSchema)