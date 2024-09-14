const express = require('express');
const router = express.Router();
const zaloPayController = require('../controllers/zaloPayController');

router.post('/create-zalopay-payment', zaloPayController.createZaloPayPayment);
router.post('/callback', zaloPayController.handleCallback); // Đảm bảo URL chính xác
router.post('/order-success/:app_trans_id', zaloPayController.orderSuccess);
router.post('/refund/:zp_trans_id/:amount/:description', zaloPayController.refundOrderZaloPay);
router.post('/query-refund/:m_refund_id', zaloPayController.queryRefundZaloPay);
module.exports = router;