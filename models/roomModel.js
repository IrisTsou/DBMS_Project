import db from '../lib/mysql.js';

const roomModel = {
  async assignTenantToRoom(roomId, tenantId) {
    // 只在房間目前沒人時才更新
    const sql = `UPDATE Room SET Tenant_ID = ? WHERE Room_ID = ? AND Tenant_ID IS NULL`;
    const [result] = await db.query(sql, [tenantId, roomId]);
    return result;
  }
};

export default roomModel;