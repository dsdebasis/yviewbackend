import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async function () {

  const DB_URI =  process.env.MONGODB_URI
  // const DB_URI =  process.env.LOCALDB_URI
  
  try { 
    const connectionDetails = await mongoose.connect(`${DB_URI}/${DB_NAME}`)
    console.log("successfully db connected",connectionDetails.connection.host)
  } catch (error) {
    console.log("error while connecting data base",error)
    process.exit(1)
  }
} 

export default connectDB