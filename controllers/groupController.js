const GroupModel = require('../models/groupModel');
const GroupsService = require("../services/groupService");

const getAllGroups = async (req, res) => {
    try {
        const groups = await GroupModel.getAllGroups();
        console.log('Grupos obtenidos:', groups);
        return res.status(200).json({
            success: true,
            message: 'Grupos obtenidos correctamente',
            data: groups
        });
    } catch (error) {
        console.error('Error al obtener los grupos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los grupos'
        });
    }
};

const getGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'El parámetro "id" debe ser un número válido para identificar el grupo.'
            });
        }
        const group = await GroupModel.getGroupById(id);
        if (!group) {
            return res.status(404).json({
                success: false,
                message: `No se encontró ningún grupo con el ID ${id}.`
            });
        }
        return res.status(200).json({
            success: true,
            message: `Grupo encontrado exitosamente. ID: ${id} - Nombre: "${group.nombre}"`,
            data: group
        });
    } catch (error) {
        console.error('Error al buscar el grupo por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al buscar el grupo por ID.'
        });
    }
};

const createGroup = async (req, res) => {
    try {
        const { description } = req.body;
        const name = req.user?.nombre;
        const createdBy = req.user?.id || req.user?.correo || 'desconocido';

        if (!name || !createdBy) {
            return res.status(400).json({
                success: false,
                message: 'El nombre y creado_por son obligatorios'
            });
        }
        const groupData = {
            description: description || null,
            name,
            createdBy,
        };
        const result = await GroupModel.createGroup(groupData);
        return res.status(201).json({
            success: true,
            message: 'Grupo creado correctamente',
            data: result
        });
    } catch (error) {
        console.error('Error al crear el grupo:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al crear el grupo',
            error: error.message
        });
    }
};

const updateGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'El campo "name" es obligatorio para actualizar el grupo.'
            });
        }
        const groupData = {
            name,
            description: description || null
        };
        const result = await GroupModel.updateGroup(id, groupData);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: `No se encontró ningún grupo con el ID ${id} para actualizar.`
            });
        }
        return res.status(200).json({
            success: true,
            message: `Grupo con ID ${id} actualizado exitosamente. Nuevo nombre: "${name}"`,
            data: result
        });
    } catch (error) {
        console.error('Error al actualizar el grupo:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar el grupo.'
        });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        return res.status(200).json({
            success: true,
            message: 'Grupo eliminado correctamente',
            data: { id }
        });
    } catch (error) {
        console.error('Error al eliminar el grupo:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar el grupo'
        });
    }
};

module.exports = {
    getAllGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup,
};