import mongoose, { Mongoose, Schema, model } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },

  videoFile: {
    type: String,
    required: true
  },
  cloudinaryVideoId:{
    type:String,
  },
  thumbnail: {
    type: String,
  },
  thumbnailCloudinaryId: {
    type:String
  },
  duration: {
    type: Number, required: true
  },
  owner: {
    type: Schema.Types.ObjectId, ref: "User"
  },
  ownerName: {
    type: String
  },
  channelProfilePic: {
    type: String
  },
  isPublished: {
    type: Boolean,
    default: false
  },

  uploadTime: {
    type: String
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
}, {
  timestamps: true
})

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = model("Video", videoSchema)