//@ts-check
const DbService = require("../config/database");
const db        = DbService.getDbServiceInstance();

class BoardModel {

  async getAllPizarras() {
    try {
      const rows = await db.query(
        "SELECT * FROM vw_pizarras_detalle ORDER BY creado_en DESC"
      );
      return rows;
    } catch (error) {
      console.error("Error en getAllPizarras:", error);
      throw error;
    }
  }

  async getPizarraById(id) {
    try {
      const rows = await db.query(
        "SELECT * FROM vw_pizarras_detalle WHERE id = ?",
        [id]
      );
      return rows;
    } catch (error) {
      console.error("Error en getPizarraById:", error);
      throw error;
    }
  }

  async getTarjetasByPizarra(pizarraId) {
    try {
      const rows = await db.query(
        `SELECT * FROM vw_tarjetas_detalle
         WHERE pizarra_id = ?
         ORDER BY creado_en DESC`,
        [pizarraId]
      );
      return rows;
    } catch (error) {
      console.error("Error en getTarjetasByPizarra:", error);
      throw error;
    }
  }


  async createPizarra({ grupo_id, titulo, descripcion, creado_por }) {
    try {
      const pizarra = await db.query(
        "CALL sp_create_pizarra(?, ?, ?, ?)",
        [grupo_id, titulo, descripcion, creado_por]
      );
      return pizarra;        
    } catch (error) {
      console.error("Error en createPizarra:", error);
      throw error;
    }
  }

  async createTarjeta({ pizarra_id, titulo, contenido, creado_por }) {
    try {
      const tarjeta = await db.query(
        "CALL sp_create_tarjeta(?, ?, ?, ?)",
        [pizarra_id, titulo, contenido, creado_por]
      );
      return tarjeta;         
    } catch (error) {
      console.error("Error en createTarjeta:", error);
      throw error;
    }
  }

  async deleteTarjeta(id) {
    try {
      const info = await db.query("CALL sp_delete_tarjeta(?)", [id]);
      return info;           
    } catch (error) {
      console.error("Error en deleteTarjeta:", error);
      throw error;
    }
  }
}

module.exports = new BoardModel();
