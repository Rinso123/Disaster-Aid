import http from 'http';
import jwt from 'jsonwebtoken';
import app from './app.js';
import { connectDB } from './config/db.js';
import User from './models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

const server = http.createServer(app);
import { Server as IOServer } from 'socket.io';
import { log } from 'console';
const io = new IOServer(server, { cors: { origin: '*' } });

app.set('io', io);

io.use(async (socket, next) => {
  const rawCookie = socket.request.headers.cookie || "";
  // parse out your token however you like. Example:
  const match = rawCookie.match(/Authorization=([^;]+)/);
  if (!match) return next(new Error("No auth cookie"));
  const bearer = match[1];
  if (!bearer) return next(new Error('Auth error'));
  try {
    const token = decodeURI(bearer).split(" ")[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = id;
    next();
  } catch {
    next(new Error('Auth error'));
  }
});

io.on('connection', async socket => {
  const user = await User.findById(socket.userId).select('role');
  if (!user) return socket.disconnect(true);
  socket.join(user.role);
});

connectDB().then(() => {
  server.listen(process.env.PORT || 4000, () =>
    console.log(`Server running on port ${process.env.PORT || 4000}`)
  );
});
