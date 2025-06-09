import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

const genToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

export const register = async (req, res) => {
  const { name, email, password, role, location } = req.body;
  if (!name || !email || !password || !location)
    return res.status(400).json({ message: 'All fields required' });

  if (!role || !['victim', 'volunteer'].includes(role))
    return res.status(400).json({ message: 'Invalid role' });

  if (await User.findOne({ email }))
    return res.status(409).json({ message: 'Email in use' });

  const hash = await bcrypt.hash(password, await bcrypt.genSalt(10));
  const user = await User.create({
    name, email, password: hash, role,
    location: { type: 'Point', coordinates: location.split(",").map(Number) }
  });
  res.cookie("Authorization", `Bearer ${genToken(user._id)}`);
  res.redirect("/")
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password))
    return res.status(401).json({ message: 'Invalid credentials' });

  res.cookie("Authorization", `Bearer ${genToken(user._id)}`);
  res.redirect("/")
};
