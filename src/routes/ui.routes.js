import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { authorize } from '../middleware/role.middleware.js';

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

export default router;
