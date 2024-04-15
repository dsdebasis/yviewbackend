import mongoose, { Schema, model } from "mongoose"
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
    required: true
  },
  duration: {
    type: Number, required: true
  },
  owner: {
    type: Schema.Types.ObjectId, ref: "User"
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

videoSchema.plugin(mongooseAggregatePaginate)
export  const Video =  model("Video",videoSchema)