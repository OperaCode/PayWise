const express = require('express');
const router = express.Router();
const { transferFunds } = require('../controllers/paymentController');

// Route to create a payment
router.post('/transfer', transferFunds);

module.exports = router;
