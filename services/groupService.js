//@ts-check
const GroupModel = require("../models/groupModel");

class GroupsService {
    async getAll() {
        try {
            const result = await GroupModel.getAllGroups();
            return result;
        } catch (error) {
            console.error("Error in getAll groups:", error);
            throw error;
        }
    }

    async findById(id) {
        try {
            const result = await GroupModel.getGroupById(id);
            return result;
        } catch (error) {
            console.error("Error in findById:", error);
            throw error;
        }
    }

    async createGroup(group) {
        try {
            const result = await GroupModel.createGroup(group);
            return result;
        } catch (error) {
            console.error("Error in createGroup:", error);
            throw error;
        }
    }

    async updateGroup(id, group) {
        try {
            const result = await GroupModel.updateGroup(id, group);
            return result;
        } catch (error) {
            console.error("Error in updateGroup:", error);
            throw error;
        }
    }

    async deleteGroup(id) {
        try {
            return { id };
        } catch (error) {
            console.error("Error in deleteGroup:", error);
            throw error;
        }
    }
}
module.exports = new GroupsService();