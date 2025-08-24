const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/check-in', async (req, res) => {
  const { userId, skill, coordinates } = req.body;
  try {
    const worker = await User.findByIdAndUpdate(userId, {
      skill,
      checkedIn: true,
      location: { type: 'Point', coordinates },
    }, { new: true });
    res.status(200).json({ message: 'Checked in successfully.', worker });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/check-out', async (req, res) => {
  const { userId } = req.body;
  try {
    const worker = await User.findByIdAndUpdate(userId, { checkedIn: false }, { new: true });
    res.status(200).json({ message: 'Checked out successfully.', worker });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;