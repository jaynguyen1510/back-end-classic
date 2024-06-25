const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authMiddleWare } = require('../middleware/authMiddleware');

router.post('/create-product', ProductController.createProducts);
router.put('/update-product/:id', authMiddleWare, ProductController.updateProducts);
router.get('/get-details/:id', ProductController.getDetailsProduct);
router.delete('/delete/:id', ProductController.deleteProduct);
router.get('/get-all', ProductController.getAllProducts);


module.exports = router;
