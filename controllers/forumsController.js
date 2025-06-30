const ForumsService = require('../services/forumsService');

const getAllForums = async (req, res) => {
    try {
        const forums = await ForumsService.getAll();
        console.log('Foros obtenidos:', forums);
        return res.status(200).json({
            success: true,
            message: 'Foros obtenidos correctamente',
            data: forums
        });
    } catch (error) {
        console.error('Error al obtener los foros:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los foros'
        });
    }
};

const getForumById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validación básica
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'El parámetro "id" debe ser un número válido para identificar el foro.'
            });
        }

        const forum = await ForumsService.findById(id);
        
        if (!forum) {
            return res.status(404).json({
                success: false,
                message: `No se encontró ningún foro con el ID ${id}. Verifique que el ID sea correcto.`
            });
        }

        return res.status(200).json({
            success: true,
            message: `Foro encontrado exitosamente. ID: ${id} - Título: "${forum.titulo}"`,
            data: forum
        });
    } catch (error) {
        console.error('Error al buscar el foro por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al buscar el foro por ID. Intente nuevamente.'
        });
    }
}

const createForum = async (req, res) => {
    try {
        const { titulo, descripcion, creado_por } = req.body;

        // Validaciones básicas
        if (!titulo || !creado_por) {
            return res.status(400).json({
                success: false,
                message: 'Título y creado_por son obligatorios'
            });
        }

        const forumData = {
            titulo,
            descripcion: descripcion || null,
            creado_por
        };

        const result = await ForumsService.createForum(forumData);
        
        return res.status(201).json({
            success: true,
            message: 'Foro creado correctamente',
            data: result
        });
    } catch (error) {
        console.error('Error al crear el foro:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al crear el foro',
            error: error.message
        });
    }
};

const updateForum = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion } = req.body;

        if (!titulo) {
            return res.status(400).json({
                success: false,
                message: 'Título es obligatorio'
            });
        }

        const forumData = {
            titulo,
            descripcion: descripcion || null
        };

        const result = await ForumsService.updateForum(id, forumData);
        
        return res.status(200).json({
            success: true,
            message: 'Foro actualizado correctamente',
            data: result
        });
    } catch (error) {
        console.error('Error al actualizar el foro:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar el foro'
        });
    }
};

const deleteForum = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await ForumsService.deleteForum(id);
        
        return res.status(200).json({
            success: true,
            message: 'Foro eliminado correctamente',
            data: result
        });
    } catch (error) {
        console.error('Error al eliminar el foro:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar el foro'
        });
    }
};


module.exports = {
    getAllForums,
    getForumById,
    createForum,
    updateForum,
    deleteForum,
};