import { pool } from "../db/client";
import { User } from "../models/User";

export class LoginDao {
  async findUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) return null;
    const u = result.rows[0];
    return new User(u.id, u.name, u.email, u.password_hash);
  }
}
