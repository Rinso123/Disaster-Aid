import express from 'express';
import { createRequest, getMatches, accept } from '../controllers/request.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();
router.post('/', authorize('victim'), createRequest);
router.get('/match', authorize('volunteer', 'admin'), getMatches);
router.post('/:id/accept', protect, authorize('volunteer'), accept);
export default router;
