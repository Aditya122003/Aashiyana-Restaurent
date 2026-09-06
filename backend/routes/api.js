const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const branchController = require('../controllers/branchController');
const menuController = require('../controllers/menuController');
const reservationController = require('../controllers/reservationController');
const orderController = require('../controllers/orderController');
const { requireAdmin } = require('../middleware/auth');

// Public endpoints
// Branches
router.get('/branches', branchController.getAllBranches);
router.get('/branches/:id', branchController.getBranchById);

// Menu & Categories
router.get('/categories', menuController.getCategories);
router.get('/menu', menuController.getMenu);
router.get('/menu/:id', menuController.getMenuItem);

// Reservations (Public)
router.get('/reservations/window', reservationController.getReservationWindow);
router.post('/reservations', reservationController.createReservation);

// WhatsApp Order logging (Public)
router.post('/orders/log', orderController.logOrder);

// Admin Auth (Public login)
router.post('/admin/login', authController.login);

// Protected Admin Endpoints
router.get('/admin/me', requireAdmin, authController.me);

// Admin Menu Management
router.post('/admin/menu', requireAdmin, menuController.createMenuItem);
router.put('/admin/menu/:id', requireAdmin, menuController.updateMenuItem);
router.put('/admin/menu/:id/branch-price', requireAdmin, menuController.updateBranchPrice);
router.delete('/admin/menu/:id', requireAdmin, menuController.deleteMenuItem);

// Admin Branch Management
router.put('/admin/branches/:id', requireAdmin, branchController.updateBranch);

// Admin Reservations
router.get('/admin/reservations', requireAdmin, reservationController.getAllReservations);
router.get('/admin/reservations/today', requireAdmin, reservationController.getTodayReservations);
router.patch('/admin/reservations/:id/status', requireAdmin, reservationController.updateStatus);

// Admin Orders
router.get('/admin/orders', requireAdmin, orderController.getOrders);

module.exports = router;
