import { Router } from "express";
import authRouter from "./auth.routes";
import slotRouter from './slot.routes';

const router = Router();

router.use("/auth", authRouter);
router.use("/slots", slotRouter);



export default router;
