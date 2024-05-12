import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"
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
app.get("/server",function(req,res){

  return res.send("server is running")
})
import userRoutes from "./routes/user.routes.js"
app.use("/api/v1/users", userRoutes)

export { app }   
