import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const pages__dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(pages__dirname);

export default async function (fastify, opts){
    fastify.get('/login',async(request, reply) =>{
        //HTMLファイルのパスを作成
        const pages_filePath = path.join(pages__dirname, '../pages/login.html');

        //ファイルの中身を読み込む
        const login_html = await fs.readFile(pages_filePath, 'utf-8');

        //ブラウザにHTMLとして送信
        return reply.type('text/html').send(login_html);
    });

    fastify.post('/login',async(request, reply)=>{
        //認証処理
        const {user_name, password} = request.body;
        
        //認証情報のバリデーションチェック
        if(!user_name || !password){
            return reply.status(401).send('ユーザIDまたはパスワードが不正です。')
            console.log(request.body);
        };
        
        //1. ユーザ認証（MySQLないのデータと照合）
        try {
            const [rows] = await fastify.loginPool.execute(
                'SELECT COUNT(*) AS count FROM users WHERE user_name = ? AND password = ?',
                [user_name, password]
            );
            const usercount = rows[0].count
            if(usercount===1){
                request.session.user = {name: user_name};
                return reply.send({message:'ログイン成功'});
            }else{
                return reply.status(401).send('ユーザ名もしくはパスワードが間違っています')
            }
        } catch (error) {
            console.error(error);
            reply.status(500).send('データベースエラーです')

        }
    });
}
