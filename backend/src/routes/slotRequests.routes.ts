import express from 'express';
import {
  getAvailableSlots,
  requestSlot,
  getUserRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
  endParkingSession,
  getPendingRequests
} from '../controllers/slotRequest.controller';

import { authenticate, checkAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/available', getAvailableSlots);
router.post('/request', requestSlot);
router.get('/my-requests', getUserRequests);
router.get('/pending', getPendingRequests);
router.post('/:id/end', endParkingSession);
router.get('/all-requests', checkAdmin, getAllRequests);
router.patch('/:id/approve', checkAdmin, approveRequest);
router.patch('/:id/reject', checkAdmin, rejectRequest);

export default router;
