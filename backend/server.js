const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// --- CORS Configured with Environment Variables ---
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["http://localhost:5173", "http://localhost:5174"]; // local run වෙනකොට fallback එකක් විදියට

app.use(cors({
    origin: allowedOrigins,
    credentials: true // Cookies හෝ Authorization headers යවනවා නම් මේක වැදගත්
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/services', require('./routes/services'));
app.use('/api/customers', require('./routes/customers'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Fuchsius API is running 🚀' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Fuchsius server running on port ${PORT}`);
});