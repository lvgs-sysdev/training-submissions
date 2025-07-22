import { pool } from "../db/client";

export class SignUpDao {
  signUp = async (email: string, password: string) => {
    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      email,
      password,
    ]);
  };

  isEmailExists = async (email: string) => {
    return await pool.query(
      `
    SELECT EXISTS (
      SELECT 1
      FROM users 
      WHERE email = $1
    )
  `,
      [email]
    );
  };
}
