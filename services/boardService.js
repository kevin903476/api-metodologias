//@ts-check
const BoardModel = require("../models/boardModel");

class BoardService {
    async getAllPizarras() {
        try {
            const result = await BoardModel.getAllPizarras();
            return result;
        } catch (error) {
            console.error("Error en getAllPizarras:", error);
            throw error;
        }
    }

    async getPizarraById(id) {
        try {
            const result = await BoardModel.getPizarraById(id);
            return result;
        } catch (error) {
            console.error("Error en getPizarraById:", error);
            throw error;
        }
    }

    async getTarjetasByPizarra(pizarraId) {
        try {
            const result = await BoardModel.getTarjetasByPizarra(pizarraId);
            return result;
        } catch (error) {
            console.error("Error en getTarjetasByPizarra:", error);
            throw error;
        }
    }

    async createTarjeta(tarjeta) {
        try {
            const result = await BoardModel.createTarjeta(tarjeta);
            return result;
        } catch (error) {
            console.error("Error en createTarjeta:", error);
            throw error;
        }
    }

    async deleteTarjeta(id) {
        try {
            const result = await BoardModel.deleteTarjeta(id);
            return result;
        } catch (error) {
            console.error("Error en deleteTarjeta:", error);
            throw error;
        }
    }

    async createPizarra(pizarra) {
        try {
            const result = await BoardModel.createPizarra(pizarra);
            return result;
        } catch (error) {
            console.error("Error en createPizarra:", error);
            throw error;
        }
    }
}

module.exports = new BoardService();