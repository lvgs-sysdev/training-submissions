require('dotenv').config();

const path = require('path');
// デフォルトのプロフィール画像パスを定義
const DEFAULT_PROFILE_IMAGE = '/image/user-1.png';

const fs = require('fs/promises')

const fastify = require('fastify')({
    logger: true
});

const fastifyStatic = require('@fastify/static');
const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,//環境変数（.env）から取得
    database: process.env.DB_NAME, //上に同じ
});
//fastify.dbで上の内容がいつでも呼び出せるようになるよ
fastify.decorate('db', db);

const session = require("@fastify/session");
const cookie = require("@fastify/cookie");
const formbody = require("@fastify/formbody");
const view = require("@fastify/view");

//bcrypt関連
const bcrypt = require('bcrypt');

fastify.register(require('@fastify/formbody'));
fastify.register(require('@fastify/cookie'));

//session設定
fastify.register(require('@fastify/session'),{
    secret: process.env.SESSION_SECRET, //秘密鍵は.envの中に保存
    cookie:{
        secure: process.env.NODE_ENV === 'production',
        maxAGE: 3600000 //セッション有効時間（秒）
    },
    saveUninitialized: false,
});

//publicを参照するように定義
fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/',
});

// ファイルアップロードプラグインを登録
fastify.register(require('@fastify/multipart'), {
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MBまで (必要に応じて調整)
    }
});

//プラグインを使うための設定
fastify.register(require('./plugins/injectContent.js'), { root: __dirname });

async function renderHomePage(request, reply) {
    try {
        const indexPath = path.join(__dirname, 'public', 'index.html');
        let dataToInject = {};

        // ログインユーザー情報の取得
        if (request.session.authenticated && request.session.userID) {
            const userID = request.session.userID;
            const [rows] = await fastify.db.execute(
                "SELECT user_id, user_name, user_img FROM users WHERE user_id = ?",
                [userID]
            );

            if (rows.length > 0) {
                const user = rows[0];
                dataToInject.USERID = user.user_id;
                dataToInject.USERNAME = user.user_name;
                dataToInject.USER_IMG_SRC = user.user_img;
            }
        }

        // 記事リストの取得とHTML生成
        const [articles] = await fastify.db.execute(`
            SELECT
                articles.article_id, articles.article_title, articles.content, articles.tag, articles.updated_at, articles.image_path,
                users.user_name AS author_name, users.user_img AS author_img
            FROM
                articles
            INNER JOIN
                users ON articles.user_id = users.user_id
            ORDER BY
                articles.updated_at DESC
            LIMIT 6
        `);

        let articlesHtml = '';
        articles.forEach(article => {
            const date = new Date(article.updated_at);
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options).replace(/,/g, '');
            const truncatedContent = article.content.substring(0, 35) + '...';

            const titleHtml = article.article_title;
            const imageSrc = article.image_path || 'image/sample2.png';

            articlesHtml += `
                <a href="/detail?id=${article.article_id}">
                    <li class="contents">
                        <div class="contents-img">
                            <img class="contents-img" src="/${imageSrc}" alt="${article.article_title}">
                        </div>
                        <div class="informationbox">
                            <p class="tag">${article.tag}</p>
                            <p class="date">${formattedDate}</p>
                        </div>
                        <p class="title">${titleHtml}</p>
                        <p class="main-text">${truncatedContent}</p>
                    </li>
                </a>
            `;
        });
        dataToInject.ARTICLES_LIST = articlesHtml;

        const htmlContent = await fastify.injectContent(
            indexPath,
            request.session,
            dataToInject
        );
        reply.type('text/html').send(htmlContent);

    } catch (err) {
        console.error('ホームページのレンダリング中にエラー:', err);
        reply.status(500).send('サーバーエラーが発生しました。');
    }
}

// 起動時のルート遷移
fastify.get('/', renderHomePage);

// 他のhtmlへのルート（home）
fastify.get('/home', renderHomePage);


// 記事詳細ページのルート
fastify.get('/detail', async (request, reply) => {
    try {
        const detailPath = path.join(__dirname, 'public', 'detail.html');
        const articleId = request.query.id;

        if (!articleId) {
            return reply.status(400).send('記事IDが指定されていません。');
        }

        const [rows] = await fastify.db.execute(`
            SELECT
                articles.article_id, articles.article_title, articles.content, articles.tag, articles.updated_at, articles.image_path,
                users.user_name AS writer_name, users.user_img AS writer_img,
                users.user_id AS writer_user_id
            FROM
                articles
            INNER JOIN
                users ON articles.user_id = users.user_id
            WHERE
                articles.article_id = ?
        `, [articleId]);

        if (rows.length === 0) {
            return reply.status(404).send('指定された記事が見つかりませんでした。');
        }

        const article = rows[0];

        const date = new Date(article.updated_at);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options).replace(/,/g, '');

        // ログインユーザーの情報を取得（detail.htmlで表示する場合やeditBlogへの遷移で使う場合）
        let loggedInUserData = {};
        if (request.session.authenticated && request.session.userID) {
            const [userRows] = await fastify.db.execute(
                "SELECT user_id, user_name, user_img FROM users WHERE user_id = ?",
                [request.session.userID]
            );
            if (userRows.length > 0) {
                loggedInUserData = {
                    USERID: userRows[0].user_id,
                    USERNAME: userRows[0].user_name,
                    USER_IMG_SRC: userRows[0].user_img
                };
            }
        }

        const dataToInject = {
            ARTICLE_ID: article.article_id,
            ARTICLE_TITLE: article.article_title,
            ARTICLE_TAG: article.tag,
            ARTICLE_DATE: formattedDate,
            ARTICLE_IMG_SRC: article.image_path ,
            ARTICLE_CONTENT: article.content,
            ARTICLE_WRITER_NAME: article.writer_name ,
            ARTICLE_WRITER_IMG: article.writer_img ,
            ...loggedInUserData // ログインユーザーの情報をマージ
        };

        const htmlContent = await fastify.injectContent(
            detailPath,
            request.session,
            dataToInject
        );
        reply.type('text/html').send(htmlContent);

    } catch (err) {
        console.error('ルート /detail の処理中にエラー:', err);
        reply.status(500).send('サーバーエラーが発生しました。');
    }
});


// 記事編集ページのルート
fastify.get('/editBlog', async (request, reply) => {
    try {
        // 1. ログインチェック
        if (!request.session.authenticated || !request.session.userID) {
            return reply.redirect('/login'); // ログインしていない場合はログインページへリダイレクト
        }

        const editBlogPath = path.join(__dirname, 'public', 'editBlog.html');
        const articleId = request.query.id; // 編集対象の記事ID

        if (!articleId) {
            return reply.status(400).send('編集対象の記事IDが指定されていません。');
        }

        //記事データの取得
        const [rows] = await fastify.db.execute(`
            SELECT
                article_id, article_title, content
            FROM
                articles
            WHERE
                article_id = ?
        `, [articleId]);

        if (rows.length === 0) {
            return reply.status(404).send('指定された記事が見つかりませんでした。');
        }

        const articleToEdit = rows[0];

        const dataToInject = {
            ARTICLE_ID: articleToEdit.article_id, // hiddenフィールド用
            ARTICLE_TITLE: articleToEdit.article_title,
            ARTICLE_CONTENT: articleToEdit.content,
        };

        //HTMLファイルを読み込み、データを置換して返却
        const htmlContent = await fastify.injectContent(
            editBlogPath,
            request.session, // ログインボックス用
            dataToInject    // 記事情報用
        );
        reply.type('text/html').send(htmlContent);

    } catch (err) {
        console.error('ルート /editBlog の処理中にエラー:', err);
        reply.status(500).send('サーバーエラーが発生しました。');
    }
});


// Loginページ ( /login )
fastify.get('/login', async (request, reply) => {
    // injectContent を使用してログインフォームをレンダリング
    const loginPath = path.join(__dirname, 'public', 'login.html');
    const htmlContent = await fastify.injectContent(
        loginPath,
        request.session,
        {} // ログインページでは通常、追加のデータは不要
    );
    reply.type('text/html').send(htmlContent);
});

// Registerページ ( /register )
fastify.get('/register', async (request, reply) => {
    // injectContent を使用して登録フォームをレンダリング
    const registerPath = path.join(__dirname, 'public', 'register.html');
    const htmlContent = await fastify.injectContent(
        registerPath,
        request.session,
        {} // 登録ページでは通常、追加のデータは不要
    );
    reply.type('text/html').send(htmlContent);
});

// profileページ ( /profile )
fastify.get('/profile', async (request, reply) => {
    const userID = request.session.userID;

    if (!userID) {
        return reply.redirect('/login');
    }

    try {
        const [rows] = await fastify.db.execute(
            "SELECT user_id, user_name, user_img FROM users WHERE user_id = ?",
            [userID]
        );

        if (rows.length === 0) {
            return reply.code(404).send({ message: 'User not found.' });
        }

        const user = rows[0];

        // dataToInject オブジェクトに必要なデータをまとめる
        const dataToInject = {
            USERID: user.user_id,
            USERNAME: user.user_name,
            USER_IMG_SRC: user.user_img // DBから取得したパスをそのまま渡す
        };

        const html = await fastify.injectContent(
            path.join(__dirname, 'public', 'profile.html'), // profile.html のパス
            request.session,
            dataToInject
        );
        reply.type('text/html').send(html);

    } catch (error) {
        console.error("Error fetching user profile:", error);
        reply.code(500).send({ message: 'Internal Server Error.' });
    }
});

// 編集ページ（ユーザー）
fastify.get('/editUser', async (request, reply) => {
    const userID = request.session.userID;

    if (!userID) {
        return reply.redirect('/login');
    }

    try {
        const [rows] = await fastify.db.execute(
            "SELECT user_id, user_name, user_img FROM users WHERE user_id = ?",
            [userID]
        );

        if (rows.length === 0) {
            return reply.code(404).send({ message: 'User not found.' });
        }

        const user = rows[0];

        // dataToInject オブジェクトに必要なデータをまとめる
        const dataToInject = {
            USERID: user.user_id,
            USERNAME: user.user_name,
            USER_IMG_SRC: user.user_img // DBから取得したパスをそのまま渡す
        };

        const html = await fastify.injectContent(
            path.join(__dirname, 'public', 'editUser.html'), // editUser.html のパス
            request.session,
            dataToInject
        );
        reply.type('text/html').send(html);

    } catch (error) {
        console.error("Error fetching user for edit:", error);
        reply.code(500).send({ message: 'Internal Server Error.' });
    }
});


//ユーザー登録の処理
fastify.post('/register', async (request, reply) => {
    const { username, userID, password, confirm_password } = request.body; //ユーザーネーム、ユーザーID、パスワード、確認用パスワードを取得
    //パスワードが確認用と一致しているか判定
    if (password !== confirm_password) {
        return reply.status(400).send({
            error: 'パスワードが一致しません'
        })
    }

    try {
        //ユーザーIDの重複チェック
        const [existingUsers] = await fastify.db.execute(  
            "SELECT * FROM users WHERE user_id = ?",
            [userID]
        );

        if (existingUsers.length > 0) { //ユーザーIDが既にあるならエラー
            return reply.status(400).send({
                error: 'そのユーザーIDはすでに使われています。'
            })
        };

        const saltRounds = 10; //ソルトラウンド数
        const hashedpassword = await bcrypt.hash(password, saltRounds); //ハッシュ化

         //データベースに新規登録
        await fastify.db.execute(
            "INSERT INTO users (user_id, password, user_name) VALUES (?, ?, ?)",
            [userID, hashedpassword, username]
        );

         //ログインページへ
        return reply.redirect('/login');
    } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: 'データベースエラー' });
    }
});

//ログイン時の処理
fastify.post("/login", async (request, reply) => {
    const { userID, password } = request.body; //IDとパスワードを取得

    try {
        const [rows] = await fastify.db.execute( // データベースから指定されたユーザーIDのユーザー情報を取得
            "SELECT * FROM users WHERE user_id = ?",
            [userID]
        );

        if (rows.length === 0) { //ユーザーが見つからない場合
            return reply.status(401).send({ error: 'ユーザーが見つかりません' });
        }

        const user = rows[0];// 取得したユーザー情報
        // 入力されたパスワードとデータベースのハッシュ化されたパスワードを比較
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            // パスワードが一致しなかった場合エラー
            return reply.status(401).send({ error: 'パスワードが間違っています' });
        }

        request.session.authenticated = true //セッションに認証済みを保存
        request.session.userID = user.user_id //セッションにIDを保存
        request.session.userName = user.user_name //セッションにユーザーネームを保存

        //ホームページへ遷移
        return reply.redirect('/home');

    } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: 'ログイン処理中にエラーが発生しました' });
    }
});

fastify.post('/logout', async (request, reply) => {
    request.session.destroy(err => {
        if (err) {
            console.error('セッション破棄エラー:', err);
            return reply.status(500).send({ error: 'ログアウト失敗' });
        }
    reply.redirect('/home'); // ログアウト後にメインページ
    });
});

const finalImageUploadDir = path.join(__dirname, 'public', 'image', 'profile'); // プロフィール画像のアップロード先
fs.mkdir(finalImageUploadDir, { recursive: true }).catch(console.error);

// ユーザー情報更新の処理
fastify.post('/save', async (request, reply) => {
    const oldUserID = request.session.userID; //現在のログインユーザーのIDをセッションから取得

    if (!oldUserID) {
        reply.code(401).send({ message: 'Unauthorized: Not logged in.' });
        return;
    }

    let NEWuserID = oldUserID; // 新しいユーザーIDの初期値は現在のユーザーID
    let NEWusername = request.session.userName || ''; // 新しいユーザーネームの初期値は現在のユーザーネーム
    let uploadedFinalPath = null; // アップロードされた画像の最終パス
    let deleteImageFlag = false; // プロフィール画像を削除するかどうかのフラグ

    // Fastify multipart プラグインの stream からデータを取得
    const parts = request.parts();
    for await (const part of parts) {
        if (part.type === 'field') {  //テキストデータの場合
            if (part.fieldname === 'NEWuserID') {
                NEWuserID = part.value; //新しいユーザーIDをセット
            } else if (part.fieldname === 'NEWusername') {
                NEWusername = part.value; //新しいユーザーネームをセット
            } else if (part.fieldname === 'deleteProfileImage') {
                deleteImageFlag = (part.value === 'true'); //画像削除フラグをセット
            }
        } else if (part.type === 'file') { //ファイルデータの場合
            if (part.fieldname === 'profileImage' && part.filename && part.filename.length > 0) {
                const uniqueFileName = `${Date.now()}-${part.filename}`; //日付データをつけてファイル名の重複を防止
                const filePath = path.join(finalImageUploadDir, uniqueFileName); //保存先のパスを生成

                try {
                    await fs.writeFile(filePath, part.file); //ファイルをローカルディスクに書き込み
                    uploadedFinalPath = `/image/profile/${uniqueFileName}`; // DBに保存するパス
                } catch (writeError) {
                    console.error("Error writing uploaded image to final path:", writeError);
                    reply.code(500).send({ message: '画像の保存に失敗しました' });
                    return;
                }
            }
        }
    }

    if (!NEWuserID || !NEWusername) {
        reply.code(400).send({ message: 'ユーザーIDとユーザーネームは必須項目です' }); //必須項目の確認
        return;
    }

    try {
        // ユーザーIDの重複チェック
        if (NEWuserID !== oldUserID) {
            const [existingUsers] = await fastify.db.execute(
                "SELECT * FROM users WHERE user_id = ?",
                [NEWuserID]
            );

            if (existingUsers.length > 0) { //既に存在するIDの場合
                if (uploadedFinalPath) {
                     //アップロードした画像を削除
                    await fs.unlink(path.join(__dirname, 'public', uploadedFinalPath));
                }
                return reply.status(400).send({
                    error: 'そのユーザーIDはすでに使われています。'
                });
            }
        }

        let sql = "UPDATE users SET user_id = ?, user_name = ?";
        const params = [NEWuserID, NEWusername];

        if (uploadedFinalPath) { //新しい画像がアップロードされた場合
            sql += ", user_img = ?"; //これを追加
            params.push(uploadedFinalPath); //画像パスをパラメータに追加
        } else if (deleteImageFlag) { //画像削除フラグがTrueなら、ユーザーイメージをNULLに
            sql += ", user_img = NULL";
        }

        sql += " WHERE user_id = ?";
        params.push(oldUserID); //現在のユーザーIDをパラメーターに追加

        await fastify.db.execute(sql, params);

         //セッションの更新
        request.session.userID = NEWuserID;
        request.session.userName = NEWusername;
        if (uploadedFinalPath) {
            request.session.userImage = uploadedFinalPath;
        }

        return reply.redirect('/profile'); //プロフィールページへリダイレクト

    } catch (error) {
        console.error("Database error during profile update:", error);
        if (uploadedFinalPath) {
            await fs.unlink(path.join(__dirname, 'public', uploadedFinalPath));
        }
        return reply.status(500).send({ error: 'データベースエラー' });
    }
});

// ブログ記事更新の処理 (POST /save_blog)
fastify.post('/save_blog', async (request, reply) => {
    //記事ID、新しいタイトル、新しい内容を取得
    const { ARTICLE_ID, NEWtitle, NEWcontents } = request.body;

    console.log('Received data for blog post save:');
    console.log('ARTICLE_ID:', ARTICLE_ID);
    console.log('NEWtitle:', NEWtitle);
    console.log('NEWcontents:', NEWcontents);

    // 必須フィールドのバリデーション
    if (!ARTICLE_ID || !NEWtitle || !NEWcontents) {
        return reply.status(400).send('Bad Request: 記事ID、タイトル、または内容が不足しています。'); //足りないものがあればエラー
    }

    try {
        //記事の存在確認
        const [articleRows] = await fastify.db.execute(
            "SELECT article_id FROM articles WHERE article_id = ?",
            [ARTICLE_ID]
        );

        if (articleRows.length === 0) { //指定された記事が存在しない場合404
            return reply.status(404).send('指定された記事が見つかりません。');
        }

        // 現在の日時を取得し、MySQLのDATETIME形式にフォーマット
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

        // データベースの更新
        await fastify.db.execute(
            "UPDATE articles SET article_title = ?, content = ?, updated_at = ? WHERE article_id = ?",
            [NEWtitle, NEWcontents, formattedDate, ARTICLE_ID]
        );

        // 更新後の記事詳細ページへリダイレクト
        reply.redirect(`/detail?id=${ARTICLE_ID}`);

    } catch (error) {
        console.error("ブログ記事の更新中にエラー:", error);
        reply.status(500).send('サーバーエラーが発生しました。');
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log('Server is runnning on http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
