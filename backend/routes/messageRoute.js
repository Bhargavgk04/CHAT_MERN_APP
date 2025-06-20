import express from "express";
import { getMessage, sendMessage, upload, uploadChatImage } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated,sendMessage);
router.route("/:id").get(isAuthenticated, getMessage);
router.route("/upload-image").post(isAuthenticated, upload.single('image'), uploadChatImage);

export default router;