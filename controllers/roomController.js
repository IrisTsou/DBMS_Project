import {
  addRoom,
  deleteRoom,
  getPropertyByRoomId,
  getPropertyByRoomIdForTenant,
  getRoomById,
  getRoomsByProperty,
  getRoomsByTenant,
  updateRoom
} from '../models/roomModel.js';

// 獲取物業下的所有房間（房東視角）
export const getRooms = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const landlordId = req.body.landlord_ID;
    const rooms = await getRoomsByProperty(propertyId, landlordId);
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 獲取單個房間（房東視角）
export const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const landlordId = req.body.landlord_ID;
    const room = await getRoomById(roomId, landlordId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 新增房間（房東視角）
export const createRoom = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const landlordId = req.body.landlord_ID;
    const roomData = req.body;
    const newRoom = await addRoom(roomData, propertyId, landlordId);
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 更新房間（房東視角）
export const updateRoomData = async (req, res) => {
  try {
    const { roomId } = req.params;
    const landlordId = req.body.landlord_ID;
    const roomData = req.body;
    const updatedRoom = await updateRoom(roomId, roomData, landlordId);
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 刪除房間（房東視角）
export const deleteRoomData = async (req, res) => {
  try {
    const { roomId } = req.params;
    const landlordId = req.body.landlord_ID;
    const room = await getRoomById(roomId, landlordId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found or not owned by landlord' });
    }
    const result = await deleteRoom(roomId, landlordId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 根據房間取得所屬房產資訊（房東視角）
export const getPropertyByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const landlordId = req.body.landlord_ID;
    const property = await getPropertyByRoomId(roomId, landlordId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found for this room or not owned by landlord' });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 獲取房客租用的所有房間（房客視角）
export const getTenantRooms = async (req, res) => {
  try {
    const tenantId = req.body.tenant_ID;
    const rooms = await getRoomsByTenant(tenantId);
    if (rooms.length === 0) {
      return res.status(404).json({ error: 'No active rooms found for this tenant' });
    }
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 獲取房客指定房間的物業資訊（房客視角）
export const getTenantRoomProperty = async (req, res) => {
  try {
    const { roomId } = req.params;
    const tenantId = req.body.tenant_ID;
    const property = await getPropertyByRoomIdForTenant(roomId, tenantId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found for this room or not rented by tenant' });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};