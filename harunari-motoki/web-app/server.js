// 環境変数の読み込み　ファイルの先頭に記述する必要がある
import 'dotenv/config';

// Fastifyのプラグインのインポート
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import formbody from '@fastify/formbody'
import fastifycookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import path from 'path'
import { fileURLToPath } from 'url'
import view from '@fastify/view'
import ejs from 'ejs'

// DBのプラグインをインポート
import dbPlugin from './js/DB.js'
//テスト用にloginPoolだけインポート
import { loginPool } from './js/DB.js'
//DBへの接続テスト
async function startServer(){
    try{
        await loginPool.getConnection();
        console.log("データベース接続成功");
    }catch(err){
        console.err("データベースの接続に失敗しました。",err);
        process.exit(1); //接続できない場合はアプリを強制終了
    }
}
// 書くjsファイルの読み込み
import toppage from './js/index.js'
import registerpage from './js/register.js' 
import loginpage from './js/login.js'
import { request } from 'http';
// ------------------------------------------------------------------------------------

/**Fastify関数の登録
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */

const fastify = Fastify({
    logger: true
})

//カレントディレクトリの取得　（ブラウザからのアクセスを許可する設定）
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

// register----------------------------------------------
//ページ遷移の紐付け
fastify.register(toppage)
fastify.register(registerpage)
fastify.register(loginpage)
// DB接続プラグイン
fastify.register(dbPlugin)
// Fastifyプラグイン
fastify.register(formbody)
//ユーザのセッション情報設定
fastify.register(fastifycookie)
fastify.register(fastifySession,{
    secret:'a-very-secret-key-at-least-32-chars-long!!', //サーバが発行する全ユーザ共通の署名用のセキュリティキー
    cookie:{
        secure: false,  //HTTPSアクセスのみを許可　本番環境ではtrueにする
        httpOnly:true,   //JavaScriptからcookieにアクセスできないようにする XXS対策
        sameSite:'lax'

    } 
});

fastify.register(view,{
    engine:{
        ejs:ejs
    },
    root: './temprates' //HTMLファイルを置くフォルダを指定 
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'js'),
  prefix: '/js/', // ブラウザからは /js/ でアクセス可能になる
});

// ログイン状況画面表示処理-----------------------------------------------------------------------------------
// セッション情報を確認してユーザ名もしくはnullを返す
fastify.decorateRequest('getUserName', function() {
    if(this.session && this.session.user){  //セッションがあり、セッション内のデータもあることを条件とする
        return this.session.user.name;
    }else{
        return null;
    }
});

// サーバ起動-----------------------------------------------------------------------------------

fastify.listen({port:3000}, function (err, address){
    if (err){
        fastify.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})

