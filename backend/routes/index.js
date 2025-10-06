import express from 'express'
import { registerController, loginController, userController, refreshController, productController, orderController, adminOrderController } from '../controllers/index.js';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';

const router = express.Router();


router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me',auth, userController.me);
router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, loginController.logout);

// Products
router.post('/products',[auth, admin], productController.store);
router.put('/products/:id',[auth, admin], productController.update);
router.delete('/products/:id',[auth, admin], productController.destroy);
router.get('/products', productController.index);
router.get('/products/:id', productController.show);

// Customer route Orders
router.post("/orders", auth, orderController.store);  // customer order karega
router.get("/customer/orders", auth, orderController.index);   // apne hi orders dekhega
router.get("/customer/orders/:id", auth, orderController.show); // Customer route: single order

// Admin route
router.get("/admin/orders", [auth, admin], adminOrderController.index); // admin sab orders dekhega
// Update order status
router.put('/admin/orders/:id/status', auth, admin, adminOrderController.updateStatus);



export default router;