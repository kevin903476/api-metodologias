//@ts-check
const accessModel = require("../models/accessModel");

class AccessService {
  async getAllAccess() {
    try {
      const result = await accessModel.getAllAccess();
      return result;
    } catch (error) {
      console.error("Error en getAllAccess:", error);
      throw error;
    }
  }

  async getTodayAccess() {
    try {
      const result = await accessModel.getTodayAccess();
      return result;
    } catch (error) {
      console.error("Error en getTodayAccess:", error);
      throw error;
    }
  }
    async getWeekAccess() {
    try {
      const result = await accessModel.getWeekAccess();
      return result;
    } catch (error) {
      console.error("Error en getWeekAccess:", error);
      throw error;
    }
  }


  async getAccessByDni(dni) {
    try {
      const result = await accessModel.getAccessByDni(dni);
      return result;
    } catch (error) {
      console.error("Error en getAccessByDni:", error);
      throw error;
    }
  } 
    async registerAccess(dni) {
        try {
        const result = await accessModel.registerAccess(dni);
        return result;
        } catch (error) {
        console.error("Error en registerAccess:", error);
        throw error;
        }
    }
    async getAccessByDate(fecha) {
  try {
    const result = await accessModel.getAccessByDate(fecha);
    return result;
  } catch (error) {
    console.error("Error en getAccessByDate:", error);
    throw error;
  }
}
}
module.exports = new AccessService();