const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authMiddleWare } = require('../middleware/authMiddleware');

router.post('/create-product', ProductController.createProducts);
router.put('/update/:id', authMiddleWare, ProductController.updateProducts);
router.get('/get-details/:id', ProductController.getDetailsProduct);
router.delete('/delete/:id', authMiddleWare, ProductController.deleteProduct);
router.get('/get-all', ProductController.getAllProducts);
router.post('/delete-many-product', authMiddleWare, ProductController.deleteManyProduct);
router.get('/get-all-type', ProductController.getAllTypeProducts);



module.exports = router;
