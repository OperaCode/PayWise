
const express = require("express");
const router = express.Router();


router.post('/webhook/flutterwave', flutterwaveWebhookHandler);



module.exports = router;