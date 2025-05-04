import mysqlConnectionPool from '../lib/mysql.js';

// 獲取房東的所有物業
async function getPropertiesByLandlord(landlordId) {
  try {
    const [rows] = await mysqlConnectionPool.query(
      'SELECT * FROM Property WHERE landlord_ID = ?',
      [landlordId]
    );
    return rows;
  } catch (error) {
    throw new Error(`Error fetching properties: ${error.message}`);
  }
}

// 獲取單個物業
async function getPropertyById(propertyId, landlordId) {
  try {
    const [rows] = await mysqlConnectionPool.query(
      'SELECT * FROM Property WHERE property_ID = ? AND landlord_ID = ?',
      [propertyId, landlordId]
    );
    return rows[0];
  } catch (error) {
    throw new Error(`Error fetching property: ${error.message}`);
  }
}

// 新增物業
async function addProperty(propertyData, landlordId) {
  try {
    const {
      size,
      type,
      address,
      status,
      shared_Wifi,
      shared_laundry,
      shared_fridge,
      shared_TV
    } = propertyData;
    const [result] = await mysqlConnectionPool.query(
      `INSERT INTO Property (
        size, type, address, status, shared_Wifi, shared_laundry, 
        shared_fridge, shared_TV, landlord_ID
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        size,
        type,
        address,
        status,
        shared_Wifi,
        shared_laundry,
        shared_fridge,
        shared_TV,
        landlordId
      ]
    );
    return { property_ID: result.insertId, ...propertyData };
  } catch (error) {
    throw new Error(`Error adding property: ${error.message}`);
  }
}

// 更新物業
async function updateProperty(propertyId, propertyData, landlordId) {
  try {
    const {
      size,
      type,
      address,
      status,
      shared_Wifi,
      shared_laundry,
      shared_fridge,
      shared_TV
    } = propertyData;
    const [result] = await mysqlConnectionPool.query(
      `UPDATE Property SET 
        size = ?, type = ?, address = ?, status = ?, 
        shared_Wifi = ?, shared_laundry = ?, shared_fridge = ?, shared_TV = ?
       WHERE property_ID = ? AND landlord_ID = ?`,
      [
        size,
        type,
        address,
        status,
        shared_Wifi,
        shared_laundry,
        shared_fridge,
        shared_TV,
        propertyId,
        landlordId
      ]
    );
    if (result.affectedRows === 0) {
      throw new Error('Property not found or not owned by landlord');
    }
    return { property_ID: propertyId, ...propertyData };
  } catch (error) {
    throw new Error(`Error updating property: ${error.message}`);
  }
}

// 刪除物業
async function deleteProperty(propertyId, landlordId) {
  try {
    const [result] = await mysqlConnectionPool.query(
      'DELETE FROM Property WHERE property_ID = ? AND landlord_ID = ?',
      [propertyId, landlordId]
    );
    if (result.affectedRows === 0) {
      throw new Error('Property not found or not owned by landlord');
    }
    return { message: 'Property deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting property: ${error.message}`);
  }
}

// 檢查物業下的可用房間
async function getAvailableRooms(propertyId, landlordId) {
  try {
    const [rows] = await mysqlConnectionPool.query(
      `SELECT r.* FROM Room r
       JOIN Property p ON r.property_ID = p.property_ID
       WHERE r.property_ID = ? AND p.landlord_ID = ? AND r.status = 0`,
      [propertyId, landlordId]
    );
    return rows;
  } catch (error) {
    throw new Error(`Error fetching available rooms: ${error.message}`);
  }
}

export {
  getPropertiesByLandlord,
  getPropertyById,
  addProperty,
  updateProperty,
  deleteProperty,
  getAvailableRooms
};