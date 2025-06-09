import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { authorize } from '../middleware/role.middleware.js';
import { getSelfRequest } from '../controllers/request.controller.js';
import { getSelfOffers } from '../controllers/offer.controller.js';

const router = express.Router();
router.get('/', (req, res) => {
  res.render('pages/index', { user: req.user });
});

router.get('/register', (req, res) => {
  if (req.user) {
    res.redirect('/');
    return;
  }

  res.render('pages/register');
});

router.get('/login', (req, res) => {
  if (req.user) {
    res.redirect('/');
    return;
  }

  res.render('pages/login');
});

router.get('/create/offer', authorize("volunteer"), (req, res) => {

  res.render('pages/create/offer', { user: req.user });
});


router.get('/create/request', authorize("victim"), (req, res) => {

  res.render('pages/create/request', { user: req.user });
});

router.get('/my', authorize("victim", "volunteer"), async (req, res) => {
  if (req.user.role === "victim") {
    const requests = await getSelfRequest(req.user.id);
    res.render('pages/my', { user: req.user, requests });
  } else if (req.user.role === "volunteer") {
    const offers = await getSelfOffers(req.user.id);
    console.log(offers);
    res.render('pages/my', { user: req.user, offers });
  } else {
    res.redirect("/")
  }
})

export default router;
