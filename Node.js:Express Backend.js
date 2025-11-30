Here is the **Node.js/Express backend** implementation for the **NotaQuest MVP**. This backend handles User Authentication, Gamification (XP/Leveling), and Score management as outlined in the spec.

### 1\. Project Setup & Dependencies

First, initialize the project and install the necessary packages to handle the server, database connection, security, and authentication.

```bash
npm init -y
npm install express pg cors dotenv bcrypt jsonwebtoken helmet morgan
```

**Directory Structure:**

```text
/backend
  ├── /config
  │    └── db.js         # Database connection
  ├── /middleware
  │    └── auth.js       # JWT Verification
  ├── /routes
  │    ├── auth.js       # Login/Register
  │    ├── gamification.js # XP, Badges, Challenges
  │    └── scores.js     # Composition loading/saving
  ├── .env               # Environment variables
  └── server.js          # Entry point
```

-----

### 2\. Database Connection (`config/db.js`)

Uses the `pg` library to connect to the PostgreSQL database defined in the previous step.

```javascript
const { Pool } = require('pg');
require('dotenv').config();

[cite_start]// [cite: 24] Database: PostgreSQL for storing user profiles, scores, and progress.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
```

-----

### 3\. Authentication Middleware (`middleware/auth.js`)

[cite\_start]Ensures data privacy for user compositions [cite: 21] and secures profile routes.

```javascript
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
```

-----

### 4\. Route Implementation

#### A. User Authentication (`routes/auth.js`)

[cite\_start]Handles secure login and profile creation with experience level selection[cite: 13].

```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// @route   POST api/auth/register
// @desc    Register user & set Experience Group
[cite_start]// [cite: 9] Experience groups: Beginner, Intermediate, Advanced
router.post('/register', async (req, res) => {
  const { username, email, password, experienceGroup } = req.body;

  try {
    // Check if user exists
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    [cite_start]// Default to 'Beginner' if not provided [cite: 9]
    const levelGroup = experienceGroup || 'Beginner';

    // Insert User
    const newUser = await db.query(
      'INSERT INTO users (username, email, password_hash, experience_group) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, hashedPassword, levelGroup]
    );

    // Return JWT
    const payload = { user: { id: newUser.rows[0].user_id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: newUser.rows[0] });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.user_id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { 
          id: user.user_id, 
          username: user.username, 
          experienceGroup: user.experience_group,
          xp: user.xp,
          level: user.level
      }});
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
```

#### B. Gamification Engine (`routes/gamification.js`)

[cite\_start]Manages the XP system, adaptive difficulty, and level progression[cite: 18, 50].

```javascript
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// @route   POST api/game/xp
// @desc    Update XP and Check for Level Up
router.post('/xp', auth, async (req, res) => {
  const { xpGained } = req.body; // e.g., 10 points for a flash-card

  try {
    // Get current user stats
    const currentUser = await db.query('SELECT xp, level FROM users WHERE user_id = $1', [req.user.id]);
    let { xp, level } = currentUser.rows[0];

    [cite_start]// [cite: 18] Gamification Engine: XP system, levels
    const newXp = xp + xpGained;
    
    // Simple leveling logic: Level up every 100 XP
    const newLevel = Math.floor(newXp / 100) + 1;
    let levelUp = false;

    if (newLevel > level) {
      level = newLevel;
      levelUp = true;
      [cite_start]// Future: Trigger "Achievement Unlocked" here [cite: 14]
    }

    // Update DB
    await db.query('UPDATE users SET xp = $1, level = $2 WHERE user_id = $3', [newXp, level, req.user.id]);

    res.json({ 
      xp: newXp, 
      level: level, 
      levelUp: levelUp,
      msg: levelUp ? "Level Up! New features unlocked." : "XP Gained" 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/game/challenges
// @desc    Get challenges filtered by Experience Group
[cite_start]// [cite: 66] MVP Phase 1: Basic recognition challenges
router.get('/challenges', auth, async (req, res) => {
    try {
        [cite_start]// Fetch user's group to serve adaptive content [cite: 18]
        const userRes = await db.query('SELECT experience_group FROM users WHERE user_id = $1', [req.user.id]);
        const group = userRes.rows[0].experience_group;

        // In a real app, these come from the DB table 'challenges'.
        [cite_start]// Mocking the "Flash-Card Challenges" [cite: 31]
        const challenges = [
            { id: 1, type: "FlashCard", note: "C/4", difficulty: "Easy", group: "Beginner" },
            { id: 2, type: "FlashCard", note: "G/4", difficulty: "Easy", group: "Beginner" },
            // Filter logic would happen in SQL query: SELECT * FROM challenges WHERE experience_group = $1
        ].filter(c => c.group === group);

        res.json(challenges);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
```

#### C. Score/Composition Management (`routes/scores.js`)

[cite\_start]Handles saving notation data (JSON/MusicXML) and retrieving it[cite: 59].

```javascript
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// @route   POST api/scores
// @desc    Save a new composition
[cite_start]// [cite: 24] Store scores and progress in Database
router.post('/', auth, async (req, res) => {
  const { title, notationData, difficulty, genre } = req.body;

  try {
    [cite_start]// notationData is stored as JSONB [cite: 59]
    const newScore = await db.query(
      'INSERT INTO scores (user_id, title, notation_data, difficulty, genre) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, title, notationData, difficulty, genre]
    );

    res.json(newScore.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/scores
// @desc    Get all scores for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const scores = await db.query('SELECT * FROM scores WHERE user_id = $1 ORDER BY score_id DESC', [req.user.id]);
    res.json(scores.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
```

-----

### 5\. Main Entry Point (`server.js`)

Connects all routes and sets up the server.

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Allow cross-origin requests
app.use(helmet()); [cite_start]// [cite: 21] Security headers
app.use(morgan('dev')); // Logging

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/game', require('./routes/gamification'));
app.use('/api/scores', require('./routes/scores'));

[cite_start]// [cite: 21] Performance: Handle concurrent users (Node.js event loop handles this efficiently)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`NotaQuest Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
```

### 6\. Next Step

Would you like me to provide the **SQL scripts to seed the database** with initial "Beginner" challenges, or would you prefer I explain how to integrate the **Frontend API calls** to these new endpoints?