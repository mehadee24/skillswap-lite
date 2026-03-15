const express = require('express');
const router = express.Router();
const { 
    search, 
    getProviders, 
    getProviderById 
} = require('../controllers/searchController');

// Search routes
router.get('/search', search);
router.get('/providers', getProviders);
router.get('/providers/:id', getProviderById);

module.exports = router;