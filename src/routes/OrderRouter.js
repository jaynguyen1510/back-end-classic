const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare, authMiddleWareOrder } = require('../middleware/authMiddleware');

router.post('/create', authMiddleWareOrder, OrderController.createOrder);
router.get('/get-order-all/:id', authUserMiddleWare, OrderController.getAllOrderDetails);
router.get('/get-details-order/:id', OrderController.getDetailsOrder);
router.delete('/cancel-order/:id', authMiddleWareOrder, OrderController.cancelDetailsOrder);

module.exports = router;
