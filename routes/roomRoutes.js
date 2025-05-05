import express from 'express';
import {
  createRoom,
  deleteRoomData,
  getPropertyByRoom,
  getRoom,
  getRooms,
  getTenantRoomProperty,
  getTenantRooms,
  updateRoomData
} from '../controllers/roomController.js';

const router = express.Router();

// 獲取房客租用的所有房間
router.get('/tenant/rooms', getTenantRooms);

// 獲取房客指定房間的物業資訊
router.get('/tenant/:roomId/property', getTenantRoomProperty);

// 獲取某物業的所有房間
router.get('/property/:propertyId', getRooms);

// 獲取單個房間
router.get('/:roomId', getRoom);

// 新增房間
router.post('/property/:propertyId', createRoom);

// 更新房間
router.put('/:roomId', updateRoomData);

// 刪除房間
router.delete('/:roomId', deleteRoomData);

// 取得房間所屬的物業資訊（房東視角）
router.get('/:roomId/property', getPropertyByRoom);

export default router;