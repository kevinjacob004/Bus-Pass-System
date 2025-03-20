const express = require('express');
import {
  createBooking,
  getAllDailyPasses,
  getUserDailyPasses,
  confirmBooking,
  getBooking,
} from "../controllers/dailyPasses.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes accessible by all authenticated users
router.post("/booking", createBooking);
router.get("/my-passes", getUserDailyPasses);
router.put("/confirm/:id", confirmBooking);
router.get("/:id", getBooking);

// Routes accessible only by staff/admin
router.get("/", authorize("staff", "admin"), getAllDailyPasses);

export default router;
