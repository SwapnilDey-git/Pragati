const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/workers', async (req, res) => {
    const { skill, lat, lng } = req.query;
    const maxDistance = 10000; // 10 kilometers
    let filter = { userType: 'worker', checkedIn: true };

    if (skill && skill !== 'all') filter.skill = skill;

    if (lat && lng) {
        filter.location = {
            $near: {
                $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                $maxDistance: maxDistance,
            },
        };
    }

    try {
        const workers = await User.find(filter);
        res.status(200).json(workers);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;