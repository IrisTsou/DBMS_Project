// routes/index.js
import express from 'express';
//import authRoutes from './authRoutes.js';
//import announcementRoutes from './announcementRoutes.js';
import propertyRoutes from './propertyRoutes.js';
import roomRoutes from './roomRoutes.js';
//import expenseRoutes from './expenseRoutes.js';
//import maintenanceRoutes from './maintenanceRoutes.js';
//import tenantRoutes from './tenantRoutes.js';
//import landlordRoutes from './landlordRoutes.js';

const router = express.Router();

// 註冊所有小路由
//router.use('/auth', authRoutes);
//router.use('/announcement', announcementRoutes);
router.use('/property', propertyRoutes);
router.use('/room', roomRoutes);
//router.use('/expense', expenseRoutes);
//router.use('/maintenance', maintenanceRoutes);
//router.use('/tenant', tenantRoutes);
//router.use('/landlord', landlordRoutes);

export default router;