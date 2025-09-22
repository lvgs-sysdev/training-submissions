const dbConfig = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: process.env.DB_PASSWORD,
	database: 'blog_app',
	connectionLimit: 3,
	namedPlaceholders: true,
};

module.exports = dbConfig;
