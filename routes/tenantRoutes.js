import express from 'express';
import tenantController from '../controllers/tenantController.js';

const router = express.Router();

router.post('/maintenance', tenantController.submitMaintenance);
router.get('/maintenance', tenantController.getMyMaintenances);
router.patch('/maintenance/:id/cancel', tenantController.cancelMaintenanceRequest);

export default router;