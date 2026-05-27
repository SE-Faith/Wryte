const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken } = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/roleMiddleware");

router.get("/user/:userId", verifyToken, authorizeRole(["admin"]), adminController.getUser);
router.get("/all", verifyToken, authorizeRole(["admin"]), adminController.getAllUsers);
router.put("/suspend/:userId", verifyToken, authorizeRole(["admin"]), adminController.suspendUser);
router.put("/ban/:userId", verifyToken, authorizeRole(["admin"]), adminController.banUser);

module.exports = router;
