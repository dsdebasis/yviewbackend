import mongoose, { Mongoose, Schema, model } from "mongoose"

const channelSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  channelName: {
    type: String,
    required:[true,"channel name is required"]
  },
  createdAt:{
    type:Date,
    required:[true,"channel creation time is required"]
  },
  profilePic:{
    type:String,
    
  },
  profilePicPubId:{
   type:String
  },
  about:{
    type:String,

  },
  totalVideos:{
    type:Number,
    
  },
  videos:[
    {type:mongoose.Schema.Types.ObjectId,
     ref:"Video",
     
    }
  ],
  subscribers:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ],
 
}, {
  timestamps: true
})

const Channel = model("Channel", channelSchema)

export default Channel