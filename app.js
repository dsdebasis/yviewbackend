import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"
const app = express()

const corsOptions = {
  origin:"https://yviewfrontend.vercel.app",

  credentials:true,
  
}

app.use(cors(corsOptions)) 
app.use(express.json())
app.use(express.urlencoded({ extended: true,
  limit: "16kb"  
}))
app.use(express.static("public"))
app.use(cookieParser())
 
import userRoutes from "./routes/user.routes.js"
app.use("/api/v1/users", userRoutes)
 
export { app }   
