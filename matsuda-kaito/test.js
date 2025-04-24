// 画像アップロードのためのただの準備
const fastify = require('fastify')({ logger: true });
const path = require('path');
const fastifyStatic = require('@fastify/static');
const multipart = require('@fastify/multipart');
const fs = require('fs');
const util = require('util');
const { pipeline } = require('stream');
const formbody = require('@fastify/formbody');

fastify.register(multipart);
fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public',
});
fastify.register(formbody);

const pump = util.promisify(pipeline);

// ここから画面
fastify.get('/', (req, reply) => {
    reply.sendFile('/views/test.html');
});

fastify.post('/', async (req, reply) => {
    const parts = req.files();

    if (parts.filename !== '') {
        for await (const part of parts) {
            await pump(part.file, fs.createWriteStream(`./public/images/${part.filename}`))

            console.log(part.fields.edit_bio.value === '');
            console.log(part.fields.username.value === '');
        }
        return { message: 'files uploaded' };
    } else {
        return { message: 'no files' };
    }
});

// サーバーを動かす
fastify.listen({ port: 8080 }, (err) => {
    if (err) {
        console.error('サーバーの起動中にエラーが発生しました:', err);
        process.exit(1);
    }
    console.log(`サーバーがポート${fastify.server.address().port}で起動しました`);
});