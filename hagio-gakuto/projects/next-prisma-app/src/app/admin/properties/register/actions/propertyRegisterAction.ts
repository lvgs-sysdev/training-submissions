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

export async function propertyRegisterAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log(formData);

  return {
    message: "ユーザー登録が完了しました。",
    errors: {},
    success: true,
    fields: {},
  };
}
