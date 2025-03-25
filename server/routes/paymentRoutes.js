const express = require('express');
const router = express.Router();
const { fundWallet,transferFunds, scheduleTransfer, pauseRecurringPayment } = require('../controllers/paymentController');

// Route to create a payment
router.post('/fund-wallet', fundWallet);
router.post('/transfer', transferFunds);
router.post('/schedule-transfer', scheduleTransfer);
router.post('/pause-recurring', pauseRecurringPayment);


module.exports = router;
