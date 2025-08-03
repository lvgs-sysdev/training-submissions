import { pool } from "../db/client";
import { User } from "../models/User";

export class UserDao {
  async findUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // ユーザーが存在しない場合はnullを返す
    if (result.rows.length === 0) {
      return null;
    }

    // 取得したデータをUserオブジェクトに変換して返す
    const u = result.rows[0];
    return new User(u.id, u.name, u.email, u.password);
  }

  async findUserById(userId: number): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    // ユーザーが存在しない場合はnullを返す
    if (result.rows.length === 0) {
      return null;
    }

    // 取得したデータをUserオブジェクトに変換して返す
    const u = result.rows[0];
    return new User(u.id, u.name, u.email, u.password);
  }

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
