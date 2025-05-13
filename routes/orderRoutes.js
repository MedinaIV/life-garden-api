const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware.authenticate);

router.post('/', orderController.createOrder);
router.get('/user', orderController.getUserOrders);
router.get('/:id', orderController.getOrderDetails);

router.get('/admin/all', authMiddleware.isAdmin, orderController.getAllOrders);
router.put('/admin/:id/status', authMiddleware.isAdmin, orderController.updateOrderStatus);


router.put('/admin/:id/approve', authMiddleware.isAdmin, orderController.approveOrder);

module.exports = router;