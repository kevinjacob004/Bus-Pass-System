import express from 'express';
import {
  getAllMorningAttendance,
  getMorningAttendanceById,
  addMorningAttendance,
  updateMorningAttendance,
  deleteMorningAttendance
} from '../controllers/morningAttendances.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);
router.use(authorize('staff','admin'));

router.post('/', addMorningAttendance);
router.get('/', getAllMorningAttendance);
router.get('/:id', getMorningAttendanceById);
router.put('/:id', updateMorningAttendance);
router.delete('/:id', deleteMorningAttendance);

export default router;