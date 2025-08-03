import { pool } from "../db/client";

export class ChangePasswordDao {
  changePassword = async (userId: number, newPssword: string) => {
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      newPssword,
      userId,
    ]);
  };
}
