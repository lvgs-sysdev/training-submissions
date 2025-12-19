'use server'

import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { ApiResponse, MySqlError } from "../../../types";
import { revalidatePath } from "next/cache";

export const updateAccountInfo = async (userId: number, formData: FormData): Promise<ApiResponse<null>> => {
  const { userName, email } = Object.fromEntries(formData.entries()) as {
    userName: string;
    email: string;
  }
  console.log(formData)

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
        userId: userId
      })

    if (result.affectedRows === 1) {
      console.log('success')
      revalidatePath('/account')
      return { success: true, status: 200, data: null }
    } else {
      return { success: false, status: 500, message: 'failed to update the account info', code: 'UPDATE_FAILED' }
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
