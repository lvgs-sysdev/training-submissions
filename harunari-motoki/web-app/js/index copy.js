import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const index__dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(index__dirname);

export default async function (fastify, opts){
    fastify.get('/',async(request, reply) =>{
        //HTMLファイルのパスを作成
        const index_filePath = path.join(index__dirname, '../index.html');

        //ファイルの中身を読み込む
        const index_html = await fs.readFile(index_filePath, 'utf-8');

        //ブラウザにHTMLとして送信
        return reply.type('text/html').send(index_html);
        
    });
}

