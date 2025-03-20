import express from 'express';
import { 
  addBus, 
  getAllBuses, 
  getBusById, 
  updateBus, 
  deleteBus, 
  getCurrentSeatsStatus,
  busSearch 
} from '../controllers/buses.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/search').get(protect, busSearch);
router.route('/').get(protect, getAllBuses).post(protect, authorize('admin','staff'), addBus);
router.route('/:id').get(protect, getBusById).put(protect, authorize('admin','staff'), updateBus).delete(protect, authorize('admin'), deleteBus);
router.route('/:id/seats').get(protect, getCurrentSeatsStatus);

export default router;
