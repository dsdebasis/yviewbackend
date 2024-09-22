import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"
import { videoRouter } from "./routes/video.routes.js"
import { rateLimit } from 'express-rate-limit'
const app = express()

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true, 
}

app.use(express.json())
app.use(express.urlencoded({
  extended: true,
  limit: "16kb"
}))
app.use(express.static("public"))
app.use(cors(corsOptions))
app.use(cookieParser())

//applying rate limitimg
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  headers: true, // Sends X-RateLimit headers for rate limit info
});

// Apply the rate limiter middleware to all routes
app.use(limiter);


app.get("/server",function(req,res){

  return res.send("server is running")
})
import userRoutes from "./routes/user.routes.js" 
app.use("/api/v1/users", userRoutes)

app.use("/api/v1/videos",videoRouter)

export { app }   
