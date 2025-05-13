const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware.authenticate);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.delete('/remove/:produtoId', cartController.removeFromCart);
router.put('/update/:produtoId', cartController.updateCartItem);
router.delete('/clear', cartController.clearCart);

module.exports = router;