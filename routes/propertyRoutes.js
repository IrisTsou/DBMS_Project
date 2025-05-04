import express from 'express';
import {
  getProperties,
  getProperty,
  createProperty,
  updatePropertyData,
  deletePropertyData,
  getAvailableRoomsData
} from '../controllers/propertyController.js';

const router = express.Router();

// 獲取房東的所有物業
router.get('/', getProperties);

// 獲取單個物業
router.get('/:propertyId', getProperty);

// 新增物業
router.post('/', createProperty);

// 更新物業
router.put('/:propertyId', updatePropertyData);

// 刪除物業
router.delete('/:propertyId', deletePropertyData);

// 獲取物業下的可用房間
router.get('/:propertyId/available-rooms', getAvailableRoomsData);

export default router;