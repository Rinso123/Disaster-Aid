import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

export const protect = async (req, res, next) => {
  const auth = req.cookies.Authorization;
  if (!auth) {
    req.user = null;
    next();
    return;
  }
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token' });

  try {
    const { id } = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(id).select('-password');
    if (!req.user) throw new Error();
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};
