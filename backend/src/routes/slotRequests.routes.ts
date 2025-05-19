import express from 'express';
import {
  getAvailableSlots,
  requestSlot,
  getUserRequests,
  getAllRequests,
  approveRequest,
  rejectRequest
} from '../controllers/slotRequest.controller';

import { authenticate, checkAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/available', getAvailableSlots);
router.post('/request', requestSlot);
router.get('/my-requests', getUserRequests);
router.get('/all-requests', checkAdmin, getAllRequests);
router.patch('/:id/approve', checkAdmin, approveRequest);
router.patch('/:id/reject', checkAdmin, rejectRequest);

export default router;
