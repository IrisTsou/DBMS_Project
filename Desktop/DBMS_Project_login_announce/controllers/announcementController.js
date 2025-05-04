import mysql from '../lib/mysql.js';

// 房東查看自己發布過的公告
export const getMyAnnouncements = async (req, res) => {
    const { landlord_ID } = req.session.user;

    try {
        const [announcements] = await mysql.query(
            'SELECT * FROM Announcement WHERE landlord_ID = ?',
            [landlord_ID]
        );

        if (announcements.length === 0) {
            return res.status(200).json({ message: "You haven't uploaded any announcements." });
        }

        res.status(200).json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// 房客查看自己居住房間的公告
export const getTenantRoomAnnouncements = async (req, res) => {
    const { tenant_ID } = req.session.user;

    try {
        const [roomRows] = await mysql.query(
            'SELECT room_ID FROM Room WHERE tenant_ID = ?',
            [tenant_ID]
        );

        if (roomRows.length === 0) {
            return res.status(404).json({ message: "You don't live in any room yet." });
        }

        const room_ID = roomRows[0].room_ID;

        const [announcements] = await mysql.query(
            'SELECT * FROM Announcement WHERE room_ID = ?',
            [room_ID]
        );

        if (announcements.length === 0) {
            return res.status(200).json({ message: "Your landlord hasn't uploaded any announcements." });
        }

        // Step 3: 回傳公告
        res.status(200).json(announcements);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 房東編輯自己發布過的公告
export const updateAnnouncement = async (req, res) => {
    const { landlord_ID } = req.session.user;
    const { announcement_ID, title, room_ID, content, category } = req.body;

    try {
        const [rows] = await mysql.query(
            'SELECT * FROM Announcement WHERE announcement_ID = ? AND landlord_ID = ?',
            [announcement_ID, landlord_ID]
        );

        if (rows.length === 0) {
            return res.status(403).json({ message: 'No permission to edit this announcement' });
        }

        await mysql.query(
            `UPDATE Announcement 
            SET title = ?, room_ID = ?, date= NOW(), content = ?, category = ? 
            WHERE announcement_ID = ?`,
            [title, room_ID, content, category, announcement_ID]
        );

        res.json({ message: 'Announcement updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 房東刪除自己發布過的公告
export const deleteAnnouncement = async (req, res) => {
    const { landlord_ID } = req.session.user;
    const { announcement_ID } = req.params;

    try {
        const [rows] = await mysql.query(
            'SELECT * FROM Announcement WHERE announcement_ID = ? AND landlord_ID = ?',
            [announcement_ID, landlord_ID]
        );

        if (rows.length === 0) {
            return res.status(403).json({ message: 'No permission to delete this announcement' });
        }

        await mysql.query(
            'DELETE FROM Announcement WHERE announcement_ID = ?',
            [announcement_ID]
        );

        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 房東新增公告
export const createAnnouncement = async (req, res) => {
    const { landlord_ID } = req.session.user;
    const { title, propety_ID, room_ID, content, category } = req.body;

    const roomIds = Array.isArray(room_ID) ? room_ID : [room_ID];

    try {
        for (const room of roomIds) {
            await mysql.query(
                `INSERT INTO Announcement (title, room_ID, date, content, category, landlord_ID)
                 VALUES (?, ?, NOW(), ?, ?, ?)`,
                [title, room, content, category, landlord_ID]
            );
        }
        res.status(201).json({ message: 'Announcement created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 查詢自己名下的 Property (下拉式選單)
export const getMyProperties = async (req, res) => {
    const { landlord_ID } = req.session.user;

    try {
        const [properties] = await mysql.query(
            'SELECT property_ID FROM Property WHERE landlord_ID = ?',
            [landlord_ID]
        );
        res.json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 根據 Property_ID 查詢對應的 Room_ID (下拉式選單)
export const getRoomsByProperty = async (req, res) => {
    const { property_ID } = req.params;

    try {
        const [rooms] = await mysql.query(
            'SELECT room_ID FROM Room WHERE property_ID = ?',
            [property_ID]
        );
        res.json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const controller = {
    getMyAnnouncements,
    getTenantRoomAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
    createAnnouncement,
    getMyProperties,
    getRoomsByProperty,
};

export default controller;
