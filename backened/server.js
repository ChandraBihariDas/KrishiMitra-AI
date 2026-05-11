import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectcloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import profileRoute from './routes/profileRoute.js';
import iotRouter from './routes/iotRoute.js';  // New import

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectcloudinary();

// Middlewares
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/farmers', profileRoute);
app.use('/api/iot', iotRouter);  // New: Mount IoT routes

app.get('/', (req, res) => {
  res.send("API WORKING - IoT Enabled");
});

// Error handler (enhanced with more logging)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

app.listen(port, () => console.log('Server started on PORT: ' + port));