import express from "express";
import { getOtherUsers, login, logout, register, updateProfile, upload, uploadProfilePhoto } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(isAuthenticated,getOtherUsers);
router.route("/profile").patch(isAuthenticated, updateProfile);
router.route("/upload-profile-photo").post(isAuthenticated, upload.single('profilePhoto'), uploadProfilePhoto);

export default router;