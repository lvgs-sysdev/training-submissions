import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const pages__dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(pages__dirname);

export default async function (fastify, opts){
    //ページを表示する
    fastify.get('/register',async(request, reply) =>{
        //HTMLファイルのパスを作成
        const pages_filePath = path.join(pages__dirname, '../pages/register.html');

        //ファイルの中身を読み込む
        const register_html = await fs.readFile(pages_filePath, 'utf-8');

        //ブラウザにHTMLとして送信
        return reply.type('text/html').send(register_html);
    });
    //ユーザ情報を新規登録する
    fastify.post('/register',async(request, reply)=>{
        //フォームから送られてきたデータを取得
        console.log('--- コンストラクタを確認 ---');
        console.log(request.constructor.name); // 'FastifyRequest' と出るはず
        console.log('--- Keysを確認 ---');
        console.log(Object.keys(request)); // request の中に何が定義されているか列挙
        
        console.log("リクエストヘッダー:", request.headers);
        console.log("response.bodyの中身:", request.body);

        const {user_name, password} = request.body;

        //データベースの保存処理
        try {
            await fastify.registerPool.execute(
                'INSERT INTO users (user_name, password) VALUES (?, ?)',
                [user_name, password]
            );
            console.log('登録データ:', request.body);

            return '登録完了しました。';
        } catch (error) {
            console.error(error);
            reply.status(500).send('データベースエラーです')
        }   
        //登録処理の完了を報告
        //インサートした情報と登録後のセレクト文の結果が一致しているかを確認する処理を入れる
        //新規登録成功のページを用意する 
        //ユーザネームの重複時にはその旨を伝えるメッセージを表示させる
    });
}
