import {Mongoose, Schema,model} from "mongoose"

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const vidoeDetailsSchema = new Schema({
  views:{
    type:Number,
  },
  likes: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  dislikes:[
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  comments:[{
    type:Mongoose.Schema.Types.ObjectId,
    ref:"User"
  }]
})

vidoeDetailsSchema.plugin(mongooseAggregatePaginate)

export const VideoDetails = model(VideoDetails,vidoeDetailsSchema)