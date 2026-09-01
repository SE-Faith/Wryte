import express from "express";
const router = express.Router();
import * as searchController from "../controllers/searchController.js";

router.get("/people", searchController.searchPeople);

export default router;
