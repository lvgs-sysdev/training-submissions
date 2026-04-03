import pool from "../../../shared/database/db.js";
import type { ResultSetHeader } from "mysql2";
// パスワードをハッシュ化させるためのライブラリ
import bcrypt from "bcrypt";

// ユーザーをデータベースに新規登録するサービス

export const createUser = async (
  account_id: string,
  account_name: string,
  email: string,
  passwordRaw: string,
  // データベースに登録した戻り値をResultSetHeaderとして型定義する。
): Promise<ResultSetHeader> => {
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(passwordRaw, saltRounds);

    const sql =
      "INSERT INTO users (account_id, account_name, email, password) VALUES(?, ?, ?, ?)";

    const [result] = await pool.execute(sql, [
      account_id,
      account_name,
      email,
      passwordHash,
    ]);

    return result as ResultSetHeader;
  } catch (error) {
    console.error("ユーザー登録中にエラーが発生しました：", error);
    throw error;
  }
};
