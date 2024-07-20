import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async function () {

  let DB_URI =  process.env.MONGODB_URI
      
  try { 
    const connectionDetails = await mongoose.connect(`${DB_URI}`)
    console.log("successfully db connected",connectionDetails.connection.host)
  } catch (error) {
    console.log("error while connecting data base",error)
    process.exit(1)
  }
} 

export default connectDB 