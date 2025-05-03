import db from '../lib/mysql.js';

const propertyModel = {

    async createProperty(data) {
      const sql = `INSERT INTO Property (Landlord_ID, Type, Address, Status, Size, Has_shared_laundry, Has_shared_fridge, Has_shared_TV, Has_shared_Wifi)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const [result] = await db.query(sql, [
        data.Landlord_ID, data.Type, data.Address, data.Status, data.Size,
        data.Has_shared_laundry, data.Has_shared_fridge, data.Has_shared_TV, data.Has_shared_Wifi
      ]);
      return result;
    },

    async deleteProperty(propertyId, landlordId) {
        const sql = `DELETE FROM Property WHERE Property_ID = ? AND Landlord_ID = ?`;
        const [result] = await db.query(sql, [propertyId, landlordId]);
        return result;
    },

    async updateProperty(propertyId, landlordId, updates) {
    const sql = `UPDATE Property SET Type = ?, Address = ?, Status = ?, Size = ? WHERE Property_ID = ? AND Landlord_ID = ?`;
    const [result] = await db.query(sql, [
      updates.Type, updates.Address, updates.Status, updates.Size,
      propertyId, landlordId
    ]);
    return result;
    },

    async updateProperty(propertyId, landlordId, updates) {
        const sql = `UPDATE Property SET Type = ?, Address = ?, Status = ?, Size = ? WHERE Property_ID = ? AND Landlord_ID = ?`;
        const [result] = await db.query(sql, [
        updates.Type, updates.Address, updates.Status, updates.Size,
        propertyId, landlordId
        ]);
        return result;
    },

    async getAvailableRooms(propertyId) {
        const sql = `SELECT * FROM Room WHERE Property_ID = ? AND Tenant_ID IS NULL`;
        const [rows] = await db.query(sql, [propertyId]);
        return rows;
      }
};

export default propertyModel;