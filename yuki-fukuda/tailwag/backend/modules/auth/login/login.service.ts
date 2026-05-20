import pool from "../../../shared/database/db.js";
import type { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";

interface UserRow extends RowDataPacket {
  id: number;
  account_id: string;
  account_name: string;
  email: string;
  password: string;
}

export const loginUser = async (email: string, passwordRow: string) => {
  const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";
  const [rows] = await pool.execute<UserRow[]>(sql, [email]);

  const user = rows[0];
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const isMatch = await bcrypt.compare(passwordRow, user.password);

  if (!isMatch) {
    throw new Error("INVALID_PASSWORD");
  }

  return {
    id: user.id,
    account_id: user.account_id,
    account_name: user.account_name,
    email: user.email,
  };
};
