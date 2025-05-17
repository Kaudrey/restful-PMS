// src/routes/slot.routes.ts (example)
import express from 'express';
import { addParkingSlot, getParkingSlots, getSlotByNumber,updateSlot,deleteSlot } from '../controllers/slot.controller';
import { authenticate, checkAdmin } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validator.middleware';

const router = express.Router();

router.use(authenticate, checkAdmin);

router.post('/add',addParkingSlot)
router.get('/', getParkingSlots);
router.get('/:number', getSlotByNumber);
router.put('/:number', updateSlot);
router.delete('/:number', deleteSlot);


export default router;
