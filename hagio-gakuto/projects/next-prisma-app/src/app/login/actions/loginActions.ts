"use server";

import { LoginSchema } from "@/lib/validators/loginValidator";
import { login } from "@/server/services/loginService";
import { cookies } from "next/headers";

// FormStateの型を拡張して、フィールドごとのエラーを格納できるようにする
interface FormState {
  message: string | null;
  errors?: {
    email?: string[];
    password?: string[];
  };
  success: boolean;
  fields?: {
    email?: string;
    password?: string;
  };
}

export async function loginAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const result = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

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

  try {
    const token = await login(result.data);

    // 2. 受け取ったJWTをHttpOnlyクッキーに設定
    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1時間
      path: "/",
    });
    return {
      message: "ログインしました。",
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
