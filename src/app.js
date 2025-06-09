import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import requestRoutes from './routes/request.routes.js';
import offerRoutes from './routes/offer.routes.js';
import adminRoutes from './routes/admin.routes.js';
import uiRoutes from './routes/ui.routes.js';
import { protect } from './middleware/auth.middleware.js';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('src/public'))
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(protect)
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/offers', offerRoutes);
app.use('/admin', adminRoutes);
app.use('/', uiRoutes);

export default app;
