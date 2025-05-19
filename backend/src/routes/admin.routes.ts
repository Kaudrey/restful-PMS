import express from 'express';
import { getAllUsers } from '../controllers/admin.controller';
import { authenticate, checkAdmin } from '../middlewares/auth.middleware';

const router = express.Router()
;
router.use(authenticate, checkAdmin);

router.get('/all-users', getAllUsers);

export default router