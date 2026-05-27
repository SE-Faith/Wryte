import express from "express";
const router = express.Router();
import * as profileController from "../controllers/profileController.js";
import authorizeRole from "../middlewares/roleMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

router.put("/update", verifyToken, profileController.updateProfile);
router.get("/get", verifyToken, profileController.getProfile);
router.put("/deactivate", verifyToken, profileController.deactivateAccount);
router.put("/activate", verifyToken, profileController.activateAccount);
router.delete("/delete", verifyToken, profileController.deleteAccount);

export default router;