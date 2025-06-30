//@ts-check
const ForumsModel = require("../models/forumsModel");

class ForumsService {
    async getAll() {
        try {
            const result = await ForumsModel.getAll();
            return result;
        } catch (error) {
            console.error("Error en getAll foros:", error);
            throw error;
        }
    }

    async findById(id) {
        try {
            const result = await ForumsModel.findById(id);
            return result;
        } catch (error) {
            console.error("Error en findById:", error);
            throw error;
        }
    }

    async createForum(forum) {
        try {
            const result = await ForumsModel.createForum(forum);
            return result;
        } catch (error) {
            console.error("Error en createForum:", error);
            throw error;
        }
    }

    async updateForum(id, forum) {
        try {
            const result = await ForumsModel.updateForum(id, forum);
            return result;
        } catch (error) {
            console.error("Error en updateForum:", error);
            throw error;
        }
    }

    async deleteForum(id) {
        try {
            const result = await ForumsModel.deleteForum(id);
            return result;
        } catch (error) {
            console.error("Error en deleteForum:", error);
            throw error;
        }
    }

}

module.exports = new ForumsService();