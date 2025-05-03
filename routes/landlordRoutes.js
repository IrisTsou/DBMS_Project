import express from 'express';
import landlordController from '../controllers/landlordController.js';
// import auth from '../middleware/auth.js' // 如果你有登入驗證功能

const router = express.Router();

router.post('/property', /* auth, */ landlordController.createProperty);
router.post('/assign-tenant', landlordController.assignTenant);
router.delete('/property/:id', /* auth, */ landlordController.deleteProperty);
router.put('/property/:id', /* auth, */ landlordController.updateProperty);
router.get('/property/:id/available-rooms', /* auth, */ landlordController.getAvailableRooms);

router.get('/maintenance', landlordController.getAllMaintenances);
router.patch('/maintenance/:id', landlordController.updateMaintenanceStatus);
router.patch('/maintenance/:id/reject', landlordController.rejectMaintenanceRequest);

export default router;