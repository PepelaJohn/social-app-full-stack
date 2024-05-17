import express from "express";
import {refreshToken} from "../controllers/refresh.js";

const router = express.Router();

router.post("/:id", refreshToken);

export default router;
