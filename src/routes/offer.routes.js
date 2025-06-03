import express from 'express';
import { createOffer, getMatches, accept } from '../controllers/offer.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();
router.post('/', authorize('volunteer'), createOffer);
router.get('/match', authorize('victim', 'admin'), getMatches);
router.post('/:id/accept', protect, authorize('victim'), accept);
export default router;
