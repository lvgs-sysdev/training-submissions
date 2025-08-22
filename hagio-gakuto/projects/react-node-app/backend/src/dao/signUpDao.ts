import { pool } from "../db/client";

export class SignUpDao {
  signUp = async (email: string, password: string) => {
    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      email,
      password,
    ]);
  };
}
