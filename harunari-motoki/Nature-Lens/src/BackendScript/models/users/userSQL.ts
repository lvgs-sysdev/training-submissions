export const registerSQL = `INSERT INTO users (user_id, user_name, password_hash) VALUES($1,$2,$3) RETURNING user_id, user_name;`;
export const loginSQL = `SELECT user_id, user_name, password_hash FROM users WHERE user_id = $1;`;
// export const authSQL = `SELECT user_id, user_name FROM users WHERE user_id = $1;`;
