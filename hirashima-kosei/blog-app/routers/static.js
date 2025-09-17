// 静的ファイルアクセス

async function staticRoutes(fastify) {
	fastify.get('/', async (request, reply) => {
		return reply.sendFile('top-page.html');
	});

	fastify.get('/login', async (request, reply) => {
		return reply.sendFile('login.html');
	});

	fastify.get('/register', async (request, reply) => {
		return reply.sendFile('register.html');
	});

	fastify.get('/detail', async (request, reply) => {
		return reply.sendFile('blog-page.html');
	});

	fastify.get('/user', async (request, reply) => {
		return reply.sendFile('profile.html');
	});

	fastify.get('/editUser', async (request, reply) => {
		return reply.sendFile('edit-profile.html');
	});

	fastify.get('/editBlog', async (request, reply) => {
		return reply.sendFile('edit-blog-page.html');
	});
}

module.exports = staticRoutes;
