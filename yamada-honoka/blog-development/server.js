const app = require('./app.js');

const start = async () => {
    try {
        await app.listen({ port: 3000});
    } catch (error) {
        console.error('エラーが発生しました', error);
        process.exit(1);
    }
};

start();