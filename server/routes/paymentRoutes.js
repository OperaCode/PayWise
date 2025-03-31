const express = require('express');
const router = express.Router();
const { fundWallet,p2PTransfer, scheduleTransfer, totalPayments,pauseRecurringPayment,getUserPaymentHistory } = require('../controllers/paymentController');


const { protectUser } = require("../middleware/authMiddleWare");



// Route to create a payment
router.post('/fund-wallet', fundWallet);
router.get('/history/:userId',protectUser,getUserPaymentHistory)
router.get('/payments', protectUser,totalPayments);
router.post('/wallet-transfer',protectUser, p2PTransfer);
router.post('/schedule-transfer', scheduleTransfer);
router.post('/pause-recurring', pauseRecurringPayment);


module.exports = router;
