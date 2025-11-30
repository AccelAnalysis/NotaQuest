require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const gamificationRoutes = require('./routes/gamification');
const scoresRoutes = require('./routes/scores');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Test DB Connection
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Database connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/scores', scoresRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('NotaQuest API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
