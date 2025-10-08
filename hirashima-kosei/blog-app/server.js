const dotenv = require('dotenv');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const envPath = path.resolve(__dirname, `./.env.${env}`);
dotenv.config({ path: envPath });

const fastify = require('fastify')();

fastify.register(require('@fastify/static'), {
	root: path.join(__dirname, 'public'),
	prefix: '/',
});

fastify.register(require('@fastify/cookie'), {
	secret: process.env.SECRET_KEY,
});

const staticRoute = require('./routers/static');
const authRoute = require('./routers/auth');
const blogRoute = require('./routers/blog');
const userRoute = require('./routers/user');

fastify.register(staticRoute);
fastify.register(authRoute);
fastify.register(blogRoute);
fastify.register(userRoute);

try {
	fastify.listen({ port: 5050 });
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
