//ts-check
const DbService = require("../config/database");
const db = DbService.getDbServiceInstance();

class GroupModel {
  async createGroup({ name, description, createdBy }) {
    try {
      const sql = `
        INSERT INTO grupos (nombre, descripcion, creado_por, creado_en)
        VALUES (?, ?, ?, NOW())
      `;
      const result = await db.query(sql, [name, description, createdBy]);
      return { id: result.insertId, name, description, createdBy, createdAt: new Date() };
    } catch (error) {
      console.error("Error in createGroup:", error.message);
      throw error;
    }
  }

  async getAllGroups() {
    try {
      const sql = `SELECT * FROM grupos`;
      const result = await db.query(sql);
      return result;
    } catch (error) {
      console.error("Error in getAllGroups:", error.message);
      throw error;
    }
  }

  async getGroupById(id) {
    try {
      const sql = `SELECT * FROM grupos WHERE id = ?`;
      const result = await db.query(sql, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error in getGroupById:", error.message);
      throw error;
    }
  }

  async updateGroup(id, { name, description }) {
    try {
      const sql = `
        UPDATE grupos
        SET nombre = ?, descripcion = ?
        WHERE id = ?
      `;
      await db.query(sql, [name, description, id]);
      return await this.getGroupById(id);
    } catch (error) {
      console.error("Error in updateGroup:", error.message);
      throw error;
    }
  }
}

module.exports = new GroupModel();