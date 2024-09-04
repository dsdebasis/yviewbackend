import mongoose, { Schema, } from "mongoose";

const PasswordResetLinkSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    email:{
        type:String,
        trim:true,
        lowercase:true,
        required:true
    },
    
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60* 5
    }
})

export const PasswordResetLink = mongoose.model("PasswordResetLink",PasswordResetLinkSchema)