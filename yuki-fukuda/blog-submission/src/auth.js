// 新規登録用のルート

module.exports = async function (fastify, options) {

    fastify.post('/register', async (request, reply) => {
        const { user_id, password, user_name } = request.body;

        console.log("受け取った名前:", user_name);

        if (!user_id || !password || !user_name) {
            return reply.code(400).send({ message: "すべての項目を入力してください" })
        }
        const query = 'INSERT INTO users (user_id, password, user_name) VALUES (?, ?, ?)';
        try {
            const [result] = await fastify.db.execute(query, [user_id, password, user_name]);
            console.log("--- MySQLからの返事ここから ---");
            console.log(result); 
            console.log("--- MySQLからの返事ここまで ---");
            return { message: "ユーザー登録が完了しました"};
        }catch (err) {
            console.error("ユーザー登録に失敗しました:", err);
            return reply.code(500).send({ message: "ユーザー登録に失敗しました", error: err.message });
        }
    });

// ログイン用のルート・セッション対応

    fastify.post('/login', async (request, reply) => {
        const { user_id,password } = request.body;

        if (!user_id || !password) {
            return reply.code(400).send({ message: "すべての項目を入力してください"})
        }
        try {
            const query = 'SELECT * FROM users WHERE user_id = ? AND password = ?'; 
            const [rows] = await fastify.db.execute(query, [user_id, password]);
            if (rows.length > 0) {
                request.session.user = {
                    id: rows[0].id,
                    user_id: rows[0].user_id,
                    user_name: rows[0].user_name
                };
                return { message: "ログインに成功しました", user_id: rows[0].user_id };
        }else {
            return reply.code(401).send({ message: "ログイン失敗"});
        }
        }catch (err) {
            return reply.code(500).send({ message: "エラーが発生しました",error: err.message});
        }
    });

    // ログイン状態を確認するためのルート
    fastify.get('/me', async (request, reply) => {
        if(request.session.user) {
            return{
                loggedIn: true,
                user: request.session.user
            };
        } else {
            return { loggedIn: false};
        }
    });

        // ログアウト用のルート
    fastify.post('/logout', async (request,reply) => {
        if(request.session.user) {
            await request.session.destroy();
            return { message:"ログアウトしました"};
        } else {
            return { message: "すでにログアウトしています"}
        }
    });
};





