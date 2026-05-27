import express from "express";
const router = express.Router();
import * as profileController from "../controllers/profileController.js";
import * as followController from "../controllers/followController.js";
import * as historyController from "../controllers/historyController.js";
import authorizeRole from "../middlewares/roleMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

// Basic profile operations
router.put("/update", verifyToken, profileController.updateProfile);
router.get("/get", verifyToken, profileController.getProfile);
router.put("/deactivate", verifyToken, profileController.deactivateAccount);
router.put("/activate", verifyToken, profileController.activateAccount);
router.delete("/delete", verifyToken, profileController.deleteAccount);

// Follow & Following operations
router.post("/follow/:userId", verifyToken, followController.followUser);
router.post("/unfollow/:userId", verifyToken, followController.unfollowUser);
router.get("/followers", verifyToken, followController.getFollowers);
router.get("/followers/:userId", verifyToken, followController.getFollowers);
router.get("/following", verifyToken, followController.getFollowing);
router.get("/following/:userId", verifyToken, followController.getFollowing);

// Viewed & Liked history operations
router.post("/view/:postId", verifyToken, historyController.logView);
router.get("/history/views", verifyToken, historyController.getViewHistory);
router.get("/history/likes", verifyToken, historyController.getLikedHistory);

export default router;