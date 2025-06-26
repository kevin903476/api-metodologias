//@ts-check
const UserModel = require("../models/userModel");

class UserService {
  async getAll() {
    try {
      const result = await UserModel.getAll();
      return result;
    } catch (error) {
      console.error("Error en getAll:", error);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const result = await UserModel.findByEmail(email);
      return result;
    } catch (error) {
      console.error("Error en findByEmail:", error);
      throw error;
    }
  }

  async registerUser(usuario) {
    try {
      const result = await UserModel.registerUser(usuario);
      return result;
    } catch (error) {
      console.error("Error en registerUser:", error);
      throw error;
    }
  }
}
module.exports = new UserService();
