import pool from "@/lib/db";
import { User, UserDB } from "./types";

// クライアントから受け取ったユーザーIDに該当するユーザーを取得する
export const fetchUserById = async (userId: string): Promise<User | undefined> => {
  try {
    const [rows] = await pool.query<UserDB[]>(`
      SELECT
        id,
        user_name,
        pic_path,
        created_at,
        updated_at
      FROM
        users
      WHERE
        users.id = :userId
      `,
    { userId: userId })

    if (rows.length === 0) return undefined

    return rows[0]
  } catch (error) {
    console.log(error)
    throw new Error('failed')
  }
}
