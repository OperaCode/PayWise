const express = require('express');
const router = express.Router();
const { transferFunds, recurringTransfer, pauseRecurringPayment } = require('../controllers/paymentController');

// Route to create a payment
router.post('/transfer', transferFunds);
router.post('/recurring-transfer', recurringTransfer);
router.post('/pause-recurring', pauseRecurringPayment);


module.exports = router;
