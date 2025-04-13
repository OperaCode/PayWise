const express = require('express');
const router = express.Router();
const { fundWallet,p2PTransfer, scheduleTransfer,scheduleRecurring,paymentAggregates ,totalPayments,pauseRecurringPayment,getUserPaymentHistory } = require('../controllers/paymentController');


const { protectUser } = require("../middleware/authMiddleWare");



// Route to create a payment
router.post('/fund-wallet', fundWallet);
router.get('/history/:userId',protectUser,getUserPaymentHistory)
router.get('/payments', protectUser,totalPayments);
router.get('/payment-summary', protectUser,paymentAggregates);
router.post('/wallet-transfer',protectUser, p2PTransfer);
router.post('/schedule-transfer',protectUser ,scheduleTransfer);
router.post('/schedule-transfer',protectUser ,scheduleRecurring);
router.post('/pause-recurring', pauseRecurringPayment);


module.exports = router;
