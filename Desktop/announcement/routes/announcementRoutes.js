import express from 'express';
import announcementController from '../controllers/announcementController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// 房東查看自己發布的公告
router.get('/my', authMiddleware, announcementController.getMyAnnouncements);

// 房客查看所居住房間的公告
router.get('/tenantroomannounce', authMiddleware, announcementController.getTenantRoomAnnouncements);

// 房東編輯公告
router.put('/update', authMiddleware, announcementController.updateAnnouncement);

// 房東刪除公告
router.delete('/:announcement_ID', authMiddleware, announcementController.deleteAnnouncement);

// 房東新增公告
router.post('/create', authMiddleware, announcementController.createAnnouncement);

// 房東查自己名下的物件
router.get('/properties', authMiddleware, announcementController.getMyProperties);

// 房東查指定物件底下的房間
router.get('/rooms/:property_ID', authMiddleware, announcementController.getRoomsByProperty);

export default router;
