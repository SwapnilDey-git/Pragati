const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/login', async (req, res) => {
  const { name, userType } = req.body;

  if (!name || !userType) {
    return res.status(400).json({ message: 'Name and user type are required.' });
  }

  try {
    // Find a user by name, or create a new one if they don't exist
    let user = await User.findOneAndUpdate(
      { name: name.trim() }, // Find criteria
      { $setOnInsert: { name: name.trim(), userType } }, // Data to insert if new
      { new: true, upsert: true } // Options: return new doc, create if not found
    );
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;