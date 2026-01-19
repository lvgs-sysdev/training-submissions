'use server'

import bcrypt from "bcryptjs";
import { ApiResponse, MySqlError } from "../../../types"
import path from "node:path";
import { writeFile } from "node:fs/promises"
import { ResultSetHeader } from "mysql2";
import pool from "@/lib/db";
import { setAuthCookie } from "@/lib/auth";
import { fileTypeFromBuffer } from "file-type";
import { VALIDATION } from "@/constants";

type validationResult = 
| { isValid: true ; buffer: Buffer | null ; extension: string | null }
| { isValid: false ; error: ApiResponse<null> }

// Bufferに変換する
const convertIntoBuffer = async (file: File): Promise<Buffer> => {
  const buffer = Buffer.from(await file.arrayBuffer())

  return buffer
}

// 画像ファイルのバリデーション
const validateFile = async (file: File): Promise<validationResult> => {
  if (!file || file.size === 0) return { isValid: true, buffer: null, extension: null }

  // サイズの確認
  if (file.size > VALIDATION.IMAGE.MAX_SIZE) return { isValid: false, error: { success: false, status: 400, message: 'File size is too large.', code: 'FILE_TOO_LARGE' } }

  const buffer = await convertIntoBuffer(file)
  const type = await fileTypeFromBuffer(buffer)

  // 拡張子の確認
  if (!type || !VALIDATION.IMAGE.ALLOWED_MIME_TYPES.some(allowedType => allowedType === type.mime)) return { isValid: false, error: { success: false, status: 400, message: 'Invalid file type.', code: 'INVALID_FILE_TYPE' } }

  return { isValid: true, buffer: buffer, extension: type.ext }
}

const generatePictureFilePaths = (extension: string) => {
  const fileName = `${crypto.randomUUID()}.${extension}`

  // 書き込み用の絶対パス（例：/var/www/project/public/uploads/***.jpg）
  const fsPath = path.join(process.cwd(), 'public', 'uploads', fileName)

  // DB保存用のパス（例：/uploads/***.jpg）
  const dbPath = `/uploads/${fileName}`

  return { fsPath, dbPath }
}

const savePictureFile = async (filePath: string, pictureBuffer: Buffer) => {
    await writeFile(filePath, pictureBuffer)
}

export const registerAccount = async (formData: FormData): Promise<ApiResponse<{userId: number} | null>> => {
  const { userName, email, password, picture } = Object.fromEntries(formData.entries()) as {
    userName: string;
    email: string;
    password: string;
    picture: File;
  }

  const picValidationResult = await validateFile(picture)

  if (!picValidationResult.isValid) return picValidationResult.error
  
  const { buffer: pictureBuffer, extension } = picValidationResult 

  const hashedPassword = await bcrypt.hash(password, 10)

  const filePaths = (pictureBuffer && extension) ? generatePictureFilePaths(extension) : null

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
    if (result.affectedRows === 1 && filePaths && pictureBuffer) {
      try {
        await setAuthCookie({id: result.insertId, user_name: userName}) // JWTのセット
        await savePictureFile(filePaths.fsPath, pictureBuffer)
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
