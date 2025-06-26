//ts-check
const DbService = require("../config/database");
const db = DbService.getDbServiceInstance();

class accessModel {
  async getAllAccess() {
    try {
      const result = await db.query(
        "SELECT * FROM vista_registros_acceso_completo"
      );
      console.log("Resultado de getAllAccess:", result);
      return result;
    } catch (error) {
      console.error("Error en getAllAccess:", error);
      throw error;
    }
  }
  async getTodayAccess() {
    try {
      const result = await db.query("SELECT * FROM vista_registros_acceso_hoy");
      console.log("Resultado de getTodayAccess:", result);
      return result;
    } catch (error) {
      console.error("Error en getTodayAccess:", error);
      throw error;
    }
  }
    async getWeekAccess() {
    try {
      const result = await db.query("SELECT * FROM vista_registros_acceso_semana_actual");
      console.log("Resultado de getWeekAccess:", result);
      return result;
    } catch (error) {
      console.error("Error en getWeekAccess:", error);
      throw error;
    }
  }
  async getAccessByDni(dni) {
    try {
      const result = await db.query("CALL obtener_accesos_por_dni(?);", [dni]);
      console.log("Resultado de getAccessByDni:", result);
      return result;
    } catch (error) {
      console.error("Error en getAccessByDni:", error);
      throw error;
    }
  }

  async registerAccess(dni) {
    try {
      const result = await db.query("CALL registrar_acceso(?);", [dni]);
      return result;
    } catch (error) {
      console.error("Error in registerAccess:", error);
      throw error;
    }
  }
async getAccessByDate(fecha) {
    try {
      // Validación de fecha
      if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
      }

      const sql = `
        SELECT 
          DATE(r.fecha_hora_acceso) as fecha,
          COUNT(DISTINCT r.id_estudiante) as estudiantes,
          COUNT(DISTINCT r.id_funcionario) as funcionarios
        FROM registros_acceso r
        WHERE DATE(r.fecha_hora_acceso) = ?
        GROUP BY DATE(r.fecha_hora_acceso)`;
      
      console.log('Ejecutando query:', sql, [fecha]);
      
      const result = await db.query(sql, [fecha]);

      return result.length > 0 ? result[0] : {
        fecha: fecha,
        estudiantes: 0,
        funcionarios: 0
      };
    } catch (error) {
      console.error('Error en getAccessByDate:', error.message);
      throw error;
    }
  }


}
module.exports = new accessModel();
