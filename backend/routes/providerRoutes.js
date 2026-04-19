const express = require('express');
const router = express.Router();
const ServiceProvider = require('../models/ServiceProvider');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get current provider profile
router.get('/profile', protect, authorize('provider'), async (req, res) => {
    try {
        const provider = await ServiceProvider.findOne({ userId: req.user.id });
        
        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider profile not found'
            });
        }
        
        res.json({
            success: true,
            profile: provider
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Update provider profile
router.put('/profile', protect, authorize('provider'), async (req, res) => {
    try {
        const { name, skills, description, currentlyWorkingOn } = req.body;
        
        const provider = await ServiceProvider.findOne({ userId: req.user.id });
        
        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider profile not found'
            });
        }
        
        // Update fields
        if (name) provider.name = name;
        if (skills) provider.skills = skills;
        if (description) provider.description = description;
        if (currentlyWorkingOn) provider.currentlyWorkingOn = currentlyWorkingOn;
        
        await provider.save();
        
        res.json({
            success: true,
            provider
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get provider by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const provider = await ServiceProvider.findById(req.params.id)
            .select('-reviews');
        
        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found'
            });
        }
        
        res.json({
            success: true,
            provider
        });
    } catch (error) {
        console.error('Get provider error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get provider reviews
router.get('/:id/reviews', async (req, res) => {
    try {
        const provider = await ServiceProvider.findById(req.params.id)
            .populate('reviews.clientId', 'name');
        
        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found'
            });
        }
        
        res.json({
            success: true,
            reviews: provider.reviews
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;