export default async function (fastify, opts){
    fastify.get('/',async(request, reply) =>{
        //1.セッションからユーザ名を取得　 sever.js のdecorateRequestを使用
        const userName = request.getUserName();
    
        //2. index.ejs に userName を渡して表示する
        //server.jsで設定したテンプレートフォルダ内の'index.js'を自動的に読みこむ
        return reply.view('index.ejs', { userName });
    });
}

