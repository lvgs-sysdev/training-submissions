"use server";

import { SignUpSchema } from "@/lib/validators/signUpValidator";
import { createUser } from "@/server/services/signUpService";
import { redirect } from "next/navigation";

// FormStateの型を拡張して、フィールドごとのエラーを格納できるようにする
interface FormState {
  message: string | null;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  success: boolean;
  fields?: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
}

export async function signUpAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const result = SignUpSchema.safeParse(Object.fromEntries(formData.entries()));

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
    await createUser(result.data);
  } catch (error: any) {
    return {
      message: error.message,
      errors: {},
      success: false,
      fields: result.data,
    };
  }

  redirect("/login");
}
