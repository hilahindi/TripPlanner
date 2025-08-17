const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express(); // Create an Express application
app.use(cors()); // Enable CORS for all routes

app.use(express.json({ limit: '5mb' })); // Parse JSON bodies with a limit of 5mb
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

mongoose.connect(process.env.MONGO_URI, { // Connect to MongoDB using the URI from environment variables
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// Connects the authentication routes to the /api/auth endpoint path
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/authMiddleware');

app.use('/api/auth', authRoutes); 

// Protected route 
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You are authorized!', userId: req.user });
});

const PORT = process.env.PORT || 5000; // Set the port from environment variables or default to 5000
app.listen(PORT, () => console.log('✅ Server running on port ${PORT}'));

const tripRoutes = require('./routes/trips'); 
app.use('/api/trips', tripRoutes);
// This connects the trip routes to the /api/trips endpoint path