import express from "express";
import { authUser, followUnfollow, getFollowers, getUser, savePost } from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyTOken.js";
import { verifyPermission } from "../middleware/verifypermission.js";
import { updateUser } from "../controllers/user.js";
import { getProfilePosts } from "../controllers/posts.js";

const router = express.Router();

router.get('/profile/posts/:id', getProfilePosts)
router.get("/profile/:id", getUser);
router.post("/auth/:page", authUser);

router.get('/followers', verifyToken, verifyPermission, getFollowers)
router.patch('/follow/:id', verifyToken, verifyPermission, followUnfollow)
router.patch("/profile", verifyToken, verifyPermission, updateUser);
router.post('/save', verifyToken, verifyPermission, savePost)

export default router;
