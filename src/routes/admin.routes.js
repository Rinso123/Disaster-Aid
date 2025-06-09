import express from 'express';
import { getRequests, deleteRequest, getOffers, deleteOffer, getUsers, deleteUser } from '../controllers/admin.controller.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/requests', authorize("admin"), getRequests);
router.post('/requests/:id', authorize("admin"), deleteRequest);


router.get('/offers', authorize("admin"), getOffers);
router.post('/offers/:id', authorize("admin"), deleteOffer);

router.get('/users', authorize("admin"), getUsers);
router.post('/users/:id', authorize("admin"), deleteUser);

export default router;
