//@ts-check
const DbService = require("../config/database");
const db = DbService.getDbServiceInstance();

class studentModel {
  async getAll() {
    try {
      const result = await db.query("SELECT * FROM estudiantes");

      console.log("Resultado de getAll:", result);
      const users = result;
      return users;
    } catch (error) {
      console.error("Error en getAll:", error);
      throw error;
    }
  }

  async registerStudent(estudiante) {
    const { dni, nombre_completo, estado, foto_url, carrera_id } = estudiante;
    try {
      const result = await db.query(
        "CALL registrar_estudiante(?, ?, ?, ?, ?)",
        [dni, nombre_completo, estado, foto_url, carrera_id]
      );
      return result;
    } catch (error) {
      console.error("Error in registerEstudiante:", error);
      throw error;
    }
  }

  async updateStudent(estudiante) {
    const { persona_id, estado, carrera_id } = estudiante;
    try {
      const result = await db.query(
        "CALL actualizar_estudiante(?, ?, ?)",
        [persona_id, estado, carrera_id]
      );
      return result;
    } catch (error) {
      console.error("Error en updateStudent:", error);
      throw error;
    }
  }
}

module.exports = new studentModel();
