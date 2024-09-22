import {Router} from "express";
import  updateViews  from "../controllers/viewsUpdate.js";
const videoRouter = Router();

videoRouter.route("/update-views/:vid").post(updateViews);

export {videoRouter};