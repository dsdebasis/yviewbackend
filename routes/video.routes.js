import { Router } from "express";
import updateViews from "../controllers/viewsUpdate.js";
import updateVideos from "../controllers/updateVideo.js";
import { authenticate } from "../middlewares/auth.mwire.js";
import { imageUpload } from "../middlewares/multer.mwire.js";
import removeVideo from "../controllers/removeVideo.js";
const videoRouter = Router();

videoRouter.route("/update-views/:vid").post(updateViews);
videoRouter
           .route("/update-videos/:vid")
           .patch(authenticate, imageUpload.single("thumbnail"), updateVideos);


videoRouter
          .route("/remove-video/:vid").delete(authenticate, removeVideo);
export { videoRouter };
