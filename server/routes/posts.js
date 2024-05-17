import express from "express";

import {
  createPost,
  deletePost,
  getComments,
  getFeed,

  getPosts,
  getProfilePosts,
  getSavedPosts,
  likeUnlikePost,
  replyToPost,
  retweetPost,
} from "../controllers/posts.js";
import { verifyPermission } from "../middleware/verifypermission.js";
import { verifyToken } from "../middleware/verifyTOken.js";
const router = express.Router();
router.get("/", getPosts);
router.get("/saved",verifyToken, verifyPermission, getSavedPosts)
router.get("/explore", verifyToken, verifyPermission, getFeed)
router.get("/:id", getProfilePosts)

router.post("/", verifyToken, verifyPermission, createPost);
router.post("/like/:postId", verifyToken, verifyPermission, likeUnlikePost);
router.post("/reply/:postId", verifyToken, verifyPermission, replyToPost);
router.get("/reply/:parentId", verifyToken, verifyPermission, getComments);
router.post("/retweet", verifyToken, verifyPermission, retweetPost);
router.delete("/delete/:id", verifyToken, verifyPermission, deletePost);

export default router;
