import express from 'express';
import {
  getAvailableSlots,
  requestSlot,
  getUserRequests,
  getAllRequests
} from '../controllers/slotRequest.controller';

import { authenticate, checkAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/available', getAvailableSlots);
router.post('/request', requestSlot);
router.get('/my-requests', getUserRequests);
router.get('/all-requests', checkAdmin, getAllRequests);

export default router;
