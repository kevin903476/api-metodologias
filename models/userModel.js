//@ts-check
const DbService = require("../config/database");
const db = DbService.getDbServiceInstance();

class UserModel {
  async getAll() {
    try {
      const result = await db.query("SELECT * FROM usuarios");
      console.log("Resultado de getAll:", result);
      return result;
    } catch (error) {
      console.error("Error en getAll:", error);
      throw error;
    }
  }

  async findByEmail(email) {
    const [rows] = await db.query(`SELECT * FROM usuarios WHERE correo = ?`, [
      email,
    ]);
    return rows;
  }

  async registerUser(usuario) {
    const { nombre, correo, clave_hash, rol_global } = usuario;
    try {
      const result = await db.query("CALL sp_insertar_usuario(?, ?, ?, ?);", [nombre, correo, clave_hash, rol_global ]);
      return result;
    } catch (error) {
      console.error("Error in registerAccess:", error);
      throw error;
    }
  }
}
module.exports = new UserModel();
