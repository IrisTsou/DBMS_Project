import mysqlConnectionPool from '../lib/mysql.js';

// 獲取物業下的所有房間
async function getRoomsByProperty(propertyId, landlordId) {
  try {
    const [rows] = await mysqlConnectionPool.query(
      `SELECT r.* FROM Room r
       JOIN Property p ON r.property_ID = p.property_ID
       WHERE r.property_ID = ? AND p.landlord_ID = ?`,
      [propertyId, landlordId]
    );
    return rows;
  } catch (error) {
    throw new Error(`Error fetching rooms: ${error.message}`);
  }
}

// 獲取單個房間
async function getRoomById(roomId, landlordId) {
  try {
    const [rows] = await mysqlConnectionPool.query(
      `SELECT r.* FROM Room r
       JOIN Property p ON r.property_ID = p.property_ID
       WHERE r.room_ID = ? AND p.landlord_ID = ?`,
      [roomId, landlordId]
    );
    return rows[0];
  } catch (error) {
    throw new Error(`Error fetching room: ${error.message}`);
  }
}

// 新增房間
async function addRoom(roomData, propertyId, landlordId) {
  try {
    const {
      size,
      type,
      status,
      rent_price,
      individual_Wifi,
      individual_laundry,
      individual_fridge,
      individual_TV
    } = roomData;
    // 驗證物業是否存在且屬於房東
    const [property] = await mysqlConnectionPool.query(
      'SELECT * FROM Property WHERE property_ID = ? AND landlord_ID = ?',
      [propertyId, landlordId]
    );
    if (!property[0]) {
      throw new Error('Property not found or not owned by landlord');
    }
    const [result] = await mysqlConnectionPool.query(
      `INSERT INTO Room (
        size, type, status, rent_price, individual_Wifi, individual_laundry, 
        individual_fridge, individual_TV, property_ID
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        size,
        type,
        status,
        rent_price,
        individual_Wifi,
        individual_laundry,
        individual_fridge,
        individual_TV,
        propertyId
      ]
    );
    return { room_ID: result.insertId, ...roomData, property_ID: propertyId };
  } catch (error) {
    throw new Error(`Error adding room: ${error.message}`);
  }
}

// 更新房間
async function updateRoom(roomId, roomData, landlordId) {
  try {
    const {
      size,
      type,
      status,
      rent_price,
      individual_Wifi,
      individual_laundry,
      individual_fridge,
      individual_TV
    } = roomData;
    const [result] = await mysqlConnectionPool.query(
      `UPDATE Room r
       JOIN Property p ON r.property_ID = p.property_ID
       SET r.size = ?, r.type = ?, r.status = ?, r.rent_price = ?, 
           r.individual_Wifi = ?, r.individual_laundry = ?, 
           r.individual_fridge = ?, r.individual_TV = ?
       WHERE r.room_ID = ? AND p.landlord_ID = ?`,
      [
        size,
        type,
        status,
        rent_price,
        individual_Wifi,
        individual_laundry,
        individual_fridge,
        individual_TV,
        roomId,
        landlordId
      ]
    );
    if (result.affectedRows === 0) {
      throw new Error('Room not found or not owned by landlord');
    }
    return { room_ID: roomId, ...roomData };
  } catch (error) {
    throw new Error(`Error updating room: ${error.message}`);
  }
}

// 刪除房間
async function deleteRoom(roomId, landlordId) {
  try {
    const [result] = await mysqlConnectionPool.query(
      `DELETE r FROM Room r
       JOIN Property p ON r.property_ID = p.property_ID
       WHERE r.room_ID = ? AND p.landlord_ID = ?`,
      [roomId, landlordId]
    );
    if (result.affectedRows === 0) {
      throw new Error('Room not found or not owned by landlord');
    }
    return { message: 'Room deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting room: ${error.message}`);
  }
}

// 根據 room_ID 找到對應的 property 資訊
async function getPropertyByRoomId(room_ID) {
  try {
    const [rows] = await mysqlConnectionPool.query(
      `SELECT Property.*
       FROM Room
       JOIN Property ON Room.property_ID = Property.property_ID
       WHERE Room.room_ID = ?`,
      [room_ID]
    );
    return rows[0];
  } catch (error) {
    throw new Error(`Error fetching property: ${error.message}`);
  }
}

// 匯出所有功能
export {
    getRoomsByProperty,
    getRoomById,
    addRoom,
    updateRoom,
    deleteRoom,
    getPropertyByRoomId
  };
