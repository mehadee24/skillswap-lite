const express = require('express');
const router = express.Router();
const axios = require('axios');
const bKashConfig = require('../config/bkash');

let authToken = null;
let tokenExpiry = null;

// Get authentication token from bKash
async function getAuthToken() {
    try {
        const response = await axios.post(bKashConfig.grantTokenUrl, {
            app_key: bKashConfig.app_key,
            app_secret: bKashConfig.app_secret
        }, {
            headers: {
                'username': bKashConfig.username,
                'password': bKashConfig.password,
                'Content-Type': 'application/json'
            }
        });
        
        authToken = response.data.id_token;
        tokenExpiry = Date.now() + (55 * 60 * 1000); // Token expires in 55 minutes
        return authToken;
    } catch (error) {
        console.error('bKash auth error:', error.response?.data || error.message);
        throw error;
    }
}

// Ensure valid token
async function ensureToken() {
    if (!authToken || Date.now() >= tokenExpiry) {
        await getAuthToken();
    }
    return authToken;
}

// Create payment
router.post('/create', async (req, res) => {
    try {
        const { amount, providerId, providerName, projectTitle } = req.body;
        
        const token = await ensureToken();
        
        const paymentRequest = {
            amount: amount.toString(),
            intent: 'sale',
            currency: 'BDT',
            merchantInvoiceNumber: `INV${Date.now()}${Math.floor(Math.random() * 1000)}`
        };
        
        const response = await axios.post(bKashConfig.createCheckoutUrl, paymentRequest, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
                'X-APP-Key': bKashConfig.app_key
            }
        });
        
        if (response.data && response.data.paymentID) {
            res.json({
                success: true,
                paymentID: response.data.paymentID,
                bkashURL: response.data.bkashURL,
                amount: amount,
                providerId: providerId,
                providerName: providerName
            });
        } else {
            res.json({
                success: false,
                message: response.data.errorMessage || 'Payment creation failed'
            });
        }
    } catch (error) {
        console.error('Create payment error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.response?.data?.errorMessage || 'Payment creation failed'
        });
    }
});

// Execute payment after authorization
router.post('/execute', async (req, res) => {
    try {
        const { paymentID } = req.body;
        
        const token = await ensureToken();
        
        const response = await axios.post(`${bKashConfig.executeCheckoutUrl}/${paymentID}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
                'X-APP-Key': bKashConfig.app_key
            }
        });
        
        if (response.data && response.data.paymentID) {
            res.json({
                success: true,
                transaction: response.data
            });
        } else {
            res.json({
                success: false,
                message: response.data.errorMessage || 'Payment execution failed'
            });
        }
    } catch (error) {
        console.error('Execute payment error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.response?.data?.errorMessage || 'Payment execution failed'
        });
    }
});

// Query payment status
router.post('/query', async (req, res) => {
    try {
        const { paymentID } = req.body;
        
        const token = await ensureToken();
        
        const response = await axios.post(`${bKashConfig.queryPaymentUrl}/${paymentID}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
                'X-APP-Key': bKashConfig.app_key
            }
        });
        
        res.json({
            success: true,
            transaction: response.data
        });
    } catch (error) {
        console.error('Query payment error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.response?.data?.errorMessage || 'Query failed'
        });
    }
});

module.exports = router;