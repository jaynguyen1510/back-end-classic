const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare, authMiddleWareOrder, authMiddleWare } = require('../middleware/authMiddleware');

router.post('/create', authMiddleWareOrder, OrderController.createOrder);
router.get('/get-order-all/:id', authUserMiddleWare, OrderController.getAllOrderDetails);
router.get('/get-details-order/:id', authMiddleWareOrder, OrderController.getDetailsOrder);
router.delete('/cancel-order/:id', OrderController.cancelDetailsOrder);
router.get('/get-all-order', authMiddleWare, OrderController.getAllOrder);


module.exports = router;
