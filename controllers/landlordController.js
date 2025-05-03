import propertyModel from '../models/propertyModel.js';
import roomModel from '../models/roomModel.js';
import maintenanceModel from '../models/maintenanceModel.js';

const landlordController = {
  // 1. 新增物件
  async createProperty(req, res) {
    try {
      const landlordId = 1; // 假設你有登入系統驗證
      const newData = {
        Landlord_ID: landlordId,
        Type: req.body.Type,
        Address: req.body.Address,
        Status: req.body.Status,
        Size: req.body.Size,
        Has_shared_laundry: req.body.Has_shared_laundry,
        Has_shared_fridge: req.body.Has_shared_fridge,
        Has_shared_TV: req.body.Has_shared_TV,
        Has_shared_Wifi: req.body.Has_shared_Wifi
      };
      const result = await propertyModel.createProperty(newData);
      res.status(201).json({ message: 'Property created successfully', result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create property' });
    }
  },

  // 2. 刪除物件
  async deleteProperty(req, res) {
    try {
      const landlordId = 1;
      const propertyId = req.params.id;
      await propertyModel.deleteProperty(propertyId, landlordId);
      res.json({ message: 'Property deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete property' });
    }
  },

  // 3. 編輯物件
  async updateProperty(req, res) {
    try {
      const landlordId = 1;
      const propertyId = req.params.id;
      const updates = {
        Type: req.body.Type,
        Address: req.body.Address,
        Status: req.body.Status,
        Size: req.body.Size
      };
      await propertyModel.updateProperty(propertyId, landlordId, updates);
      res.json({ message: 'Property updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update property' });
    }
  },

  // 4. 查看某個物件的可用房間
  async getAvailableRooms(req, res) {
    try {
      const propertyId = req.params.id;
      const rooms = await propertyModel.getAvailableRooms(propertyId);
      res.json(rooms);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to get available rooms' });
    }
  },

  // 5. 指派租客到房源
  async assignTenant(req, res) {
    try {
      const { roomId, tenantId } = req.body;

      // 執行分配
      const result = await roomModel.assignTenantToRoom(roomId, tenantId);

      if (result.affectedRows === 0) {
        return res.status(400).json({ message: 'Room already assigned or not found.' });
      }

      res.json({ message: 'Tenant assigned to room successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to assign tenant.' });
    }
  },

  // 得到維修紀錄
  async getAllMaintenances(req, res) {
    try {
      const landlord_ID = 1; // 測試用
      const result = await maintenanceModel.getRequestsByLandlord(landlord_ID);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Fetch failed' });
    }
  },

  // 更新維修狀態
  async updateMaintenanceStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reply } = req.body;
  
      const result = await maintenanceModel.updateStatusAndReply(id, status, reply);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Maintenance request not found' });
      }
  
      res.json({ message: 'Status updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Update failed' });
    }
  },

  // 房東拒絕維修申請
  async rejectMaintenanceRequest(req, res) {
    try {
      const maintenance_ID = req.params.id;
      const { reply } = req.body;
  
      const result = await maintenanceModel.rejectRequest(maintenance_ID, reply);
  
      if (result.affectedRows === 0) {
        return res.status(400).json({ message: 'Cannot reject: already processed or not found' });
      }
  
      res.json({ message: 'Request rejected' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Reject failed' });
    }
  }

};

export default landlordController;