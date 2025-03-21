const express = require('express');
const router = express.Router();
const { transferFunds, scheduleTransfer, pauseRecurringPayment } = require('../controllers/paymentController');

// Route to create a payment
router.post('/transfer', transferFunds);
router.post('/schedule-transfer', scheduleTransfer);
router.post('/pause-recurring', pauseRecurringPayment);


module.exports = router;
