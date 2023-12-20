const express = require('express');
const { requireSignIn } = require('../middleware/authMiddleware');
const { createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController } = require('../controllers/productController');
const formidable = require('express-formidable');

const router = express.Router();

router.post('/create-product', requireSignIn, formidable(), createProductController)

router.put('/update-product/:pid', requireSignIn, formidable(), updateProductController)

router.get('/get-product', getProductController);

router.get('/get-product/:slug', getSingleProductController);

router.get('/product-photo/:pid', productPhotoController);

router.delete('/delete-product/:pid', deleteProductController);

module.exports = router;