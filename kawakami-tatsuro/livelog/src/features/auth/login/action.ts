'use server'

import pool from "@/lib/db";
import { ApiResponse } from "../../../../types";
import { UserLogin } from "./types";
import bcrypt from "bcryptjs";
import { setAuthCookie } from "@/lib/auth";

export const login = async (formData: FormData): Promise<ApiResponse<null>> => {
  const { email, password } = Object.fromEntries(formData.entries()) as {
    email: string;
    password: string;
  }

  try {
    const [rows] = await pool.query<UserLogin[]>(`
      SELECT
        id,
        user_name,
        password
      FROM
        users
      WHERE
        email = :email
      `,
      { email: email })

    const user = rows[0]

    if(!user) return { success: false, status: 401, message: 'The email address or password is incorrect.' }

    const isValidPassword = await bcrypt.compare(password, user.password) // ユーザーが入力したパスワードとDBのハッシュ化されたパスワードを比較

    if (!isValidPassword) return { success: false, status: 401, message: 'The email address or password is incorrect.' }

    await setAuthCookie(user) // JWTのセット
      
    return { success: true, status: 200, data: null }
  } catch (error) {
    console.log(error)
    return { success: false, status: 500, message: 'Internal Server Error.' }
  }
}
