const express = require('express');
const router = express.Router();
const zaloPayController = require('../controllers/zaloPayController');

router.post('/create-zalopay-payment', zaloPayController.createZaloPayPayment);
router.post('/callback', zaloPayController.handleCallback); // Đảm bảo URL chính xác
router.post('/order-success/:app_trans_id', zaloPayController.orderSuccess);
module.exports = router;