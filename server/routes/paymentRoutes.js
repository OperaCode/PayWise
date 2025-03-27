const express = require('express');
const router = express.Router();
const { fundWallet,p2PTransfer, scheduleTransfer, pauseRecurringPayment,getUserPaymentHistory } = require('../controllers/paymentController');


const { protectUser } = require("../middleware/authMiddleWare");



// Route to create a payment
router.post('/fund-wallet', fundWallet);
router.get('/payments/history/:userId', getUserPaymentHistory)
router.post('/wallet-transfer',protectUser, p2PTransfer);
router.post('/schedule-transfer', scheduleTransfer);
router.post('/pause-recurring', pauseRecurringPayment);


module.exports = router;
