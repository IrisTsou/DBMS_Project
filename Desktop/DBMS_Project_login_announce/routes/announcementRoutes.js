import express from 'express';
import announcementController from '../controllers/announcementController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// 查看房東發布的公告
router.get('/my', authMiddleware, announcementController.getMyAnnouncements);

// 查看房客所居住房間的公告
router.get('/tenantroomannounce', authMiddleware, announcementController.getTenantRoomAnnouncements);

// 編輯公告
router.put('/update', authMiddleware, announcementController.updateAnnouncement);

// 刪除公告
router.delete('/:announcement_ID', authMiddleware, announcementController.deleteAnnouncement);

// 新增公告
router.post('/create', authMiddleware, announcementController.createAnnouncement);

// 查自己名下的物件
router.get('/properties', authMiddleware, announcementController.getMyProperties);

// 查指定物件底下的房間
router.get('/rooms/:property_ID', authMiddleware, announcementController.getRoomsByProperty);

export default router;
