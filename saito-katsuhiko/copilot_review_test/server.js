const fastify = require('fastify')({ logger: true });
const mysql = require('mysql2/promise');

// MySQL接続設定
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'twitter_clone'
};

// トップページ（ツイート一覧）
fastify.get('/', async (request, reply) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute(
            'SELECT tweets.id, tweets.content, tweets.created_at, users.username FROM tweets JOIN users ON tweets.user_id = users.id ORDER BY tweets.created_at DESC'
        );
        reply.type('text/html').send(`
            <h1>ツイート一覧</h1>
            <ul>
                ${rows.map(tweet => `
                    <li>
                        <strong>${tweet.username}</strong>: ${tweet.content} (${tweet.created_at})
                    </li>
                `).join('')}
            </ul>
        `);
    } finally {
        await connection.end();
    }
});

// サーバー起動
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log('Server is running on http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
