const express = require('express');
const router = express.Router();
const { fundWallet,p2PTransfer,withdrawToBank ,scheduleTransfer,redeemPayCoin,scheduleRecurring,paymentAggregates ,totalPayments,pauseRecurringPayment,getUserPaymentHistory,deleteTransaction } = require('../controllers/paymentController');


const { protectUser } = require("../middleware/authMiddleWare");



// Route to create a payment
router.post('/fund-wallet', fundWallet);
router.post('/withdraw-fund', withdrawToBank);
router.get('/history/:userId',protectUser,getUserPaymentHistory)
router.get('/payments', protectUser,totalPayments);
router.get('/payment-summary', protectUser,paymentAggregates);
router.post('/wallet-transfer',protectUser, p2PTransfer);
router.post('/schedule-transfer',protectUser ,scheduleTransfer);
router.post('/schedule-recurring',protectUser ,scheduleRecurring);
router.post('/redeem-coin',protectUser ,redeemPayCoin);
router.post('/pause-recurring', pauseRecurringPayment);
router.delete('/delete/:transactionId',protectUser ,deleteTransaction);


module.exports = router;
