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

    async findById(id) {
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
                WHERE f.id = ?
            `, [id]);
            
            console.log(`Búsqueda por ID ${id} - Resultado:`, result[0] ? 'Encontrado' : 'No encontrado');
            if (result.length > 0) {
                console.log(`Foro encontrado: "${result[0].titulo}"`);
            }
            
            return result[0]; // Retorna el primer elemento del array de resultados
        } catch (error) {
            console.error(`Error crítico al buscar foro por ID ${id}:`, error);
            console.error("Detalles del error SQL:", {
                message: error.message,
                code: error.code,
                errno: error.errno,
                sqlState: error.sqlState,
                parametroBusqueda: id,
                tipoParametro: typeof id
            });
            throw new Error(`Error en la base de datos al buscar el foro con ID ${id}: ${error.message}`);
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