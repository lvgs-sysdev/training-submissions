import fp from 'fastify-plugin' // 機能の範囲を広げるプラグイン
// DBへのプラグインをfastify-pluginでラップすることで、DBへのコネクションプールがファイル（機能）
// ごとに作成されるのを防止することができる
import mysql from 'mysql2/promise'//mysqlに接続するようのプラグイン

// 以下の処理ではコネクションプールの箱を作るだけ
// 接続が可能かどうかはserver.jsの起動時に行う
export const registerPool = await mysql.createPool({
        host: process.env.DB_register_host,
        user: process.env.DB_register_user,
        password: process.env.DB_register_pass,
        database: process.env.DB_register_db,

    connectionLimit: 10 //最大接続数
    }
);

export const loginPool = await mysql.createPool({
        host: process.env.DB_login_host,
        user: process.env.DB_login_user,
        password: process.env.DB_login_pass,
        database: process.env.DB_login_db,

    connectionLimit: 10 //最大接続数
    }
);

async function dbPlugin(fastify,opts){
    fastify.decorate('registerPool',registerPool);
    fastify.decorate('loginPool',loginPool);
}

export default fp(dbPlugin);
