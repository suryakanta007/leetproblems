import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlayListDetails, removeProblemFromPlaylist } from "../controllers/playlist.controllers.js";

const router  = Router();

router.route("/").get(authMiddleware,getAllListDetails)
router.route("/:playlistId").get(authMiddleware,getPlayListDetails)
router.route("/create-playlist").post(authMiddleware,createPlaylist)
router.route("/:playListId/add-Problem").post(authMiddleware,addProblemToPlaylist);
router.route("/:playListId").delete(authMiddleware,deletePlaylist);
router.route("/:playlistId/delete-problem").delete(authMiddleware,removeProblemFromPlaylist);

export default router