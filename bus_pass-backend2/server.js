import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import busRoutes from './routes/buses.js';
import routeRoutes from './routes/routes.js';
import routeStopsRoutes from './routes/routeStops.js';
import morningAttendanceRoutes from './routes/morningAttendance.js';
import offDaysRoutes from './routes/offDays.js';
import dailyPassesRoutes from './routes/dailyPasses.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/buses', busRoutes);
app.use('/routes', routeRoutes);
app.use('/route-stops', routeStopsRoutes);
app.use('/morning-attendance', morningAttendanceRoutes);
app.use('/off-days', offDaysRoutes);
app.use('/day-passes', dailyPassesRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
