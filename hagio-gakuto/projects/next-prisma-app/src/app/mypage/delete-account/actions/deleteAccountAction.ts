"use server";

import { DeleteAccountSchema } from "@/lib/validators/deleteAccountValidator";
import { deleteAccount } from "@/server/services/deleteAccountService";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// FormStateの型を拡張して、フィールドごとのエラーを格納できるようにする
interface FormState {
  message: string | null;
  errors?: {
    password?: string[];
    confirmPassword?: string[];
  };
  success: boolean;
  fields?: {
    password?: string;
    confirmPassword?: string;
  };
}

export async function deleteAccountAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const result = DeleteAccountSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  // バリデーション失敗時
  if (!result.success) {
    const fields = Object.fromEntries(formData.entries());
    return {
      message: "入力内容にエラーがあります。",
      errors: result.error.flatten().fieldErrors,
      success: false,
      fields,
    };
  }

  const cookie = await cookies();
  const token = cookie.get("session_token")?.value;
  if (!token) {
    return {
      message: "セッションが無効です。再度ログインしてください。",
      errors: {},
      success: false,
      fields: result.data,
    };
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
      userId: number;
    };
    const userId = payload.userId;
    await deleteAccount(userId, result.data);
    return {
      message: "アカウントが削除されました。",
      errors: {},
      success: true,
      fields: result.data,
    };
  } catch (error: any) {
    return {
      message: error.message,
      errors: {},
      success: false,
      fields: result.data,
    };
  }
}
