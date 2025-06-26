// Se conecta con la bd 
//@ts-check

const DbService = require("../config/database");
const db = DbService.getDbServiceInstance();

class ForumsModel {
    async getAll() {
        try {
            const result = await db.query(`
                SELECT 
                    f.id,
                    f.titulo,
                    f.descripcion,
                    CASE 
                        WHEN f.es_publico = 1 THEN 'Sí' 
                        ELSE 'No' 
                    END as es_publico,
                    f.creado_por,
                    u.nombre as creador_nombre,
                    f.creado_en
                FROM foros f
                INNER JOIN usuarios u ON f.creado_por = u.id
                ORDER BY f.creado_en DESC
            `);
            console.log("Resultado de getAll foros:", result);
            return result;
        } catch (error) {
            console.error("Error en getAll foros:", error);
            throw error;
        }
    }

    async findByTitle(titulo) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    f.id,
                    f.titulo,
                    f.descripcion,
                    CASE 
                        WHEN f.es_publico = 1 THEN 'Sí' 
                        ELSE 'No' 
                    END as es_publico,
                    f.creado_por,
                    u.nombre as creador_nombre,
                    f.creado_en
                FROM foros f
                INNER JOIN usuarios u ON f.creado_por = u.id
                WHERE f.titulo = ?
            `, [titulo]);
            return rows;
        } catch (error) {
            console.error("Error al buscar el foro por título:", error);
            throw error;
        }
    }

    async createForum(forum) {
        const { titulo, descripcion, creado_por } = forum;
        try {
            const result = await db.query("CALL sp_insertar_foro(?, ?, ?);", [titulo, descripcion, creado_por]);
            return result;
        } catch (error) {
            console.error("Error in createForum:", error);
            throw error;
        }
    }

    async updateForum(id, forum) {
        const { titulo, descripcion } = forum;
        try {
            const result = await db.query(
                "UPDATE foros SET titulo = ?, descripcion = ? WHERE id = ?", 
                [titulo, descripcion, id]
            );
            return result;
        } catch (error) {
            console.error("Error al actualizar el foro:", error);
            throw error;
        }
    }

    async deleteForum(id) {
        try {
            const result = await db.query("DELETE FROM foros WHERE id = ?", [id]);
            return result;
        } catch (error) {
            console.error("Error al eliminar el foro:", error);
            throw error;
        }
    }

}
module.exports = new ForumsModel();