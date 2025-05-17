import { Router } from "express";
import authRouter from "./auth.routes";
import slotRouter from './slot.routes';
import slotRequestRouter from './slotRequests.routes';

const router = Router();

router.use("/auth", authRouter);
router.use("/slots", slotRouter);
router.use("/slot-requests", slotRequestRouter);



export default router;
