import {mongoose} from "mongoose"

let checkMongoDbId = function(string){

    return mongoose.Types.ObjectId.isValid(string)
}

export {checkMongoDbId}