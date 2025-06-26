const mysql = require('mysql2');
const dotenv = require('dotenv');
const process = require('process');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: 20,
    queueLimit: 0,
    acquireTimeout: 10000  
});

// Usar el pool en modo promesa
const poolPromise = pool.promise();

// Declarar una variable para mantener la instancia única
let instance = null;

class DbService {
    // Método estático para obtener la instancia única
    static getDbServiceInstance() {
        return instance ? instance : (instance = new DbService());
    }

    constructor() {
        this.pool = poolPromise;
    }

    async query(query, params = []) {
        try {
            const [results] = await this.pool.query(query, params);
            return results;
        } catch (error) {
            console.error('Error en la consulta:', error);
            throw error;
        }
    }
}

module.exports = DbService;
