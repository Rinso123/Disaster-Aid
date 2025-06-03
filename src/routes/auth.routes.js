import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { authorize } from '../middleware/role.middleware.js';
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
export default router;
