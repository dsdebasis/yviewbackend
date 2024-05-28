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
  thumbnail: {
    type: String,

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
  userInteractionWithVideos: {
    type: Schema.Types.ObjectId,
    ref: "VideoDetails"
  }
}, {
  timestamps: true
})

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = model("Video", videoSchema)