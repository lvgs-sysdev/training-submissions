require('dotenv').config();

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

const fastifyPlugin = require('fastify-plugin') 
const mysql = require('mysql2/promise') 

async function dbConnector(fastify, options) {
    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            connectionLimit: 3,
            namedPlaceholders: true,
        });
        fastify.decorate('mysql' , pool);

    fastify.addHook('onClose', (instance, done ) => {
        instance.mysql.end(done);
    });

    fastify.log.info('データベース接続に成功しました');

    } catch (error) {
        fastify.log.error('データベース接続に失敗しました', error);
        throw error;
    }
}

module.exports = fastifyPlugin(dbConnector);