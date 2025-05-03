import maintenanceModel from '../models/maintenanceModel.js';

const tenantController = {
  async submitMaintenance(req, res) {
    try {
      const tenant_ID = 1; // 測試階段先寫死
      const { item, description, date, room_ID } = req.body;

      const result = await maintenanceModel.createRequest({
        item,
        description,
        date,
        room_ID,
        tenant_ID
      });

      res.status(201).json({ message: 'Request submitted', result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Submission failed' });
    }
  },

  async getMyMaintenances(req, res) {
    try {
      const tenant_ID = 1; // 測試用
      const result = await maintenanceModel.getRequestsByTenant(tenant_ID);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Fetch failed' });
    }
  },

  // 租客取消申請
  async cancelMaintenanceRequest(req, res) {
    try {
      const tenant_ID = 1; // 測試階段
      const maintenance_ID = req.params.id;
  
      const result = await maintenanceModel.cancelRequest(maintenance_ID, tenant_ID);
  
      if (result.affectedRows === 0) {
        return res.status(400).json({ message: 'Cannot cancel: not found or already processed' });
      }
  
      res.json({ message: 'Request cancelled' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cancel failed' });
    }
  }
};

export default tenantController;