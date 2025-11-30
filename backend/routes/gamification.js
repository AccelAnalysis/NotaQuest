const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// @route   GET api/gamification/profile
// @desc    Get user's gamification profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await db.query(
      'SELECT id, username, xp, level FROM users WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get user's achievements
    const achievements = await db.query(
      'SELECT a.* FROM achievements a JOIN user_achievements ua ON a.id = ua.achievement_id WHERE ua.user_id = $1',
      [req.user.id]
    );

    res.json({
      profile: user.rows[0],
      achievements: achievements.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/gamification/add-xp
// @desc    Add XP to user's profile
// @access  Private
router.put('/add-xp', auth, async (req, res) => {
  const { xp } = req.body;
  
  if (!xp || xp <= 0) {
    return res.status(400).json({ msg: 'Please provide a valid XP amount' });
  }

  try {
    // Start a transaction
    await db.query('BEGIN');

    // Add XP and update level if needed
    const result = await db.query(
      `UPDATE users 
       SET xp = xp + $1,
           level = CASE 
             WHEN xp + $1 >= (level + 1) * 1000 THEN level + 1 
             ELSE level 
           END
       WHERE id = $2
       RETURNING id, username, xp, level`,
      [xp, req.user.id]
    );

    // Check for level up
    const user = result.rows[0];
    let levelUpMessage = null;
    
    if (user.xp >= user.level * 1000) {
      levelUpMessage = `Level up! You are now level ${user.level}`;
    }

    await db.query('COMMIT');
    
    res.json({ 
      success: true, 
      xp: user.xp, 
      level: user.level,
      message: levelUpMessage
    });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/gamification/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await db.query(
      'SELECT id, username, xp, level FROM users ORDER BY level DESC, xp DESC LIMIT 50'
    );
    
    res.json(leaderboard.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
