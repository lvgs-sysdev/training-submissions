import { AccountInfo, AccountInfoDB } from "./types"
import pool from "@/lib/db"

export const fetchAccountInfo = async (userId: number): Promise<AccountInfo | undefined> => {
  try {
    const [rows] = await pool.query<AccountInfoDB[]>(`
      SELECT
        id,
        user_name,
        email,
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
