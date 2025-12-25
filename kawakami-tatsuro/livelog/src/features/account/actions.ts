'use server'

import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { ApiResponse, MySqlError } from "../../../types";
import { revalidatePath } from "next/cache";
import { getVerifiedUser } from "@/lib/auth";

export const updateAccountInfo = async (formData: FormData): Promise<ApiResponse<null>> => {
  const user = await getVerifiedUser()
  if (!user) return { success: false, status: 401, message: 'The session timed out.', code: 'UNAUTHORIZED' }

  const { userName, email } = Object.fromEntries(formData.entries()) as {
    userName: string;
    email: string;
  }

  try{
    const [result] = await pool.query<ResultSetHeader>(`
      UPDATE
        users
      SET
        user_name = :userName,
        email = :email
      WHERE
        id = :userId
      `,
      {
        userName: userName,
        email: email,
        userId: user.id
      })

    if (result.affectedRows === 1) {
      revalidatePath('/account')
      return { success: true, status: 200, data: null }
    } else {
      return { success: false, status: 404, message: 'This account is not found.', code: 'NOT_FOUND' }
    }
  } catch (error) {
    const err = error as MySqlError
    if (err.code === 'ER_DUP_ENTRY') {
      return { success: false, status: 409, message: 'This email address is already in use.', code: 'EMAIL_DUPLICATE' }
    }
    console.log(error)
    return { success: false, status: 500, message: 'server error' }
  }
}
