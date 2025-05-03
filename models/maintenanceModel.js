import db from '../lib/mysql.js';

const maintenanceModel = {
  async createRequest({ item, description, date, room_ID, tenant_ID }) {
    const sql = `
      INSERT INTO Maintenance (item, description, date, status, room_ID, tenant_ID)
      VALUES (?, ?, ?, 'pending', ?, ?)
    `;
    const [result] = await db.query(sql, [item, description, date, room_ID, tenant_ID]);
    return result;
  },

  async getRequestsByTenant(tenant_ID) {
    const sql = `
      SELECT * FROM Maintenance
      WHERE tenant_ID = ?
      ORDER BY date DESC
    `;
    const [rows] = await db.query(sql, [tenant_ID]);
    return rows;
  },

  async getRequestsByLandlord(landlord_ID) {
    const sql = `
      SELECT m.*, t.tenant_name, r.type AS room_type, p.Address AS property_address
      FROM Maintenance m
      JOIN Room r ON m.room_ID = r.room_ID
      JOIN Property p ON r.property_ID = p.Property_ID
      JOIN Tenant t ON m.tenant_ID = t.tenant_ID
      WHERE p.Landlord_ID = ?
      ORDER BY m.date DESC
    `;
    const [rows] = await db.query(sql, [landlord_ID]);
    return rows;
  },

  // 更新狀態
  async updateStatusAndReply(maintenance_ID, status, reply) {
    const sql = `
      UPDATE Maintenance
      SET status = ?, reply = ?
      WHERE maintenance_ID = ?
    `;
    const [result] = await db.query(sql, [status, reply, maintenance_ID]);
    return result;
  },

  // 租客取消申請
  async cancelRequest(maintenance_ID, tenant_ID) {
    const sql = `
      UPDATE Maintenance
      SET status = 'cancelled'
      WHERE maintenance_ID = ? AND tenant_ID = ? AND status = 'pending'
    `;
    const [result] = await db.query(sql, [maintenance_ID, tenant_ID]);
    return result;
  },

  // 房東拒絕維修
  async rejectRequest(maintenance_ID, reply) {
    const sql = `
      UPDATE Maintenance
      SET status = 'rejected', reply = ?
      WHERE maintenance_ID = ? AND status = 'pending'
    `;
    const [result] = await db.query(sql, [reply, maintenance_ID]);
    return result;
  }
};

export default maintenanceModel;