import express from 'express';
import { getAllOffDays, getOffDayById, createOffDay, updateOffDay, deleteOffDay } from '../controllers/offDays.js';
import { protect, authorize } from '../middleware/auth.js';


const router = express.Router();

router.route('/')
  .get(getAllOffDays)
  .post(createOffDay);

router.route('/:id')
  .get(getOffDayById)
  .put(updateOffDay)
  .delete(deleteOffDay);

export default router;