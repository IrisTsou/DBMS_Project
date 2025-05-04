import {
    getRoomsByProperty,
    getRoomById,
    addRoom,
    updateRoom,
    deleteRoom,
    getPropertyByRoomId
  } from '../models/roomModel.js';
  
  // 獲取物業下的所有房間
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
  
  // 獲取單個房間
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
  
  // 新增房間
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
  
  // 更新房間
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
  
  // 刪除房間
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

  // 根據房間取得所屬房產資訊
  export const getPropertyByRoom = async (req, res) => {
    try {
      const room_ID = req.params.id;
      const property = await getPropertyByRoomId(room_ID);
      if (!property) {
        return res.status(404).json({ error: 'Property not found for this room' });
      }
      res.status(200).json(property);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
