import express from 'express';
import {
  getRooms,
  getRoom,
  createRoom,
  updateRoomData,
  deleteRoomData,
  getPropertyByRoom
} from '../controllers/roomController.js';

const router = express.Router();

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

// 取得房間所屬的物業資訊
router.get('/room/:id/property', getPropertyByRoom);

export default router;
