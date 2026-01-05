'use server'

import bcrypt from "bcryptjs";
import { ApiResponse, MySqlError } from "../../../../types"
import path from "node:path";
import { writeFile } from "node:fs/promises"
import { ResultSetHeader } from "mysql2";
import pool from "@/lib/db";
import { setAuthCookie } from "@/lib/auth";

// 本来は画像ファイルの拡張子、サイズのチェックが必要だが現時点では実装できていない

const generatePictureFilePaths = (pictureName: string) => {
  const extension = pictureName.split('.').slice(-1)[0] // 拡張子を取得
  const fileName = `${crypto.randomUUID()}.${extension}`

  // 書き込み用の絶対パス（例：/var/www/project/public/uploads/***.jpg）
  const fsPath = path.join(process.cwd(), 'public', 'uploads', fileName)

  // DB保存用のパス（例：/uploads/***.jpg）
  const dbPath = `/uploads/${fileName}`

  return { fsPath, dbPath }
}

const savePictureFile = async (filePath: string, picture: File) => {
    const pictureBuffer = Buffer.from(await picture.arrayBuffer())
    await writeFile(filePath, pictureBuffer)
}

export const registerAccount = async (formData: FormData): Promise<ApiResponse<{userId: number}>> => {
  const { userName, email, password, picture } = Object.fromEntries(formData.entries()) as {
    userName: string;
    email: string;
    password: string;
    picture: File;
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const filePaths = picture.size !== 0 ? generatePictureFilePaths(picture.name) : null

  try {
    const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO
        users
        (user_name, email, password, pic_path)
      VALUES
        (:userName, :email, :hashedPassword, :picPath)
      `,
      {
        userName: userName,
        email: email,
        hashedPassword: hashedPassword,
        picPath: filePaths ? filePaths.dbPath : null
      })
    
    // DBへの登録が成功し、かつプロフィール画像をアップロードした場合
    if (result.affectedRows === 1 && filePaths) {
      try {
        await setAuthCookie({id: result.insertId, user_name: userName}) // JWTのセット
        await savePictureFile(filePaths.fsPath, picture)
      } catch (error) {
        // 画像保存に失敗した場合、DBの画像パスを削除する処理も追加すべきだが、アイコン表示に問題がある場合のフォールバック処理（フロントエンド）はあるため一旦今回は何もしない
        console.log(error)
        return { success: true, status: 201, data: {userId: result.insertId}, code: 'IMG_UPLOAD_FAILED' }
      }
    }

    return { success: true, status: 201, data: {userId: result.insertId} }
  } catch (error) {
    const err = error as MySqlError
    
    if (err.code === 'ER_DUP_ENTRY') {
      return { success: false, status: 409, message: 'This email address is already in use.', code: 'EMAIL_DUPLICATE' }
    } else {
      return { success: false, status: 500, message: 'Internal Error', code: 'REGISTRATION_FAILED' }
    }
  }
}
