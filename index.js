import  "dotenv/config"


import connectDB from "./db/dbconfig.js"
import { app } from "./app.js"

connectDB()
  .then(()=>{
    app.on("error",()=>{
      console.log("error in express at index.js file at the root")
    })
    
    const PORT = process.env.PORT || 7001
    // console.log("PORT",process.env.PORT)
    app.listen(PORT,()=>{
      console.log(`app is connected at http://localhost:${PORT}`)
      
    })
  })
  .catch(()=>{
    console.log("error while connecting to express server ")
  })
 