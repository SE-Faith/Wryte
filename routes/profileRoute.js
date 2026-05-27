const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authorizeRole = require("../middlewares/roleMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware");

router.put("/update", verifyToken, profileController.updateProfile);
router.get("/get", verifyToken, profileController.getProfile);
router.put("/deactivate", verifyToken, profileController.deactivateAccount);
router.put("/activate", verifyToken, profileController.activateAccount);
router.delete("/delete", verifyToken, profileController.deleteAccount);
module.exports = router;