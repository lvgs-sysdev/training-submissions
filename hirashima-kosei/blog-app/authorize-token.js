// アクセストークンを検証するAPIはこの関数を使用
// アクセストークンの署名を検証
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authorizeToken = async (accessToken) => {
	return new Promise((resolve, reject) => {
		jwt.verify(accessToken, process.env.SECRET_KEY, (err, decoded) => {
			if (err) {
				return reject(err);
			}
			return resolve(decoded);
		});
	});
};

module.exports = authorizeToken;
