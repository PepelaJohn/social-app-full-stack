import express from "express";
import { verifyToken } from "../middleware/verifyTOken.js";
import { verifyPermission } from "../middleware/verifypermission.js";
import { createMessage, getMessage, getMessages } from "../controllers/user.js";
import { addParticipantToGroup, createGroup, createGroupMessage, getGroupMessages } from "../controllers/group.js";
const router = express.Router();

router.get("/", verifyToken, verifyPermission, getMessages);


router.get("/group/:groupId", verifyToken, verifyPermission, getGroupMessages)
router.post("/group/new", verifyToken, verifyPermission, createGroup)
router.patch("/group/:groupId", verifyToken, verifyPermission, addParticipantToGroup)
router.post("/group/:groupId", verifyToken, verifyPermission, createGroupMessage)




router.get("/:id", verifyToken, verifyPermission, getMessage);
router.post("/", verifyToken, verifyPermission, createMessage);

export default router;
