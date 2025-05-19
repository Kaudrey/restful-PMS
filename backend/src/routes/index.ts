import { Router } from "express";
import authRouter from "./auth.routes";
import slotRouter from './slot.routes';
import slotRequestRouter from './slotRequests.routes';
import AdminRouter from './admin.routes';

const router = Router();

router.use("/auth", authRouter);
router.use("/slots", slotRouter);
router.use("/slot-requests", slotRequestRouter);
router.use('/admin',AdminRouter)



export default router;
