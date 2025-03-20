const express = require('express');
import { protect, authorize } from '../middleware/auth.js';
import { searchRouteStops, deleteRouteStop } from '../controllers/routeStops.js';
const router = express.Router();

router.route('/search').get(protect, authorize('admin'), searchRouteStops);
router.route('/:id').delete(protect, authorize('admin'), deleteRouteStop);

export default router;