"use server";

import { InquiryPropertySchema } from "@/lib/validators/inquiryPropertyValidator";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { postInquiry } from "@/server/services/inquiryService";

// --- 型定義 ---
type SchemaFields = z.infer<typeof InquiryPropertySchema>;
interface FormState {
  message: string | null;
  errors?: {
    [K in keyof SchemaFields]?: string[];
  } & {
    _form?: string[];
  };
  success: boolean;
  fields?: Partial<SchemaFields>;
}
export async function postInquiryAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validationResult = validateFormData(formData);

  if (!validationResult.success) {
    return {
      message: "入力内容にエラーがあります。",
      errors: validationResult.error.flatten().fieldErrors,
      success: false,
      fields: Object.fromEntries(formData.entries()), // ユーザーが入力した値をフォームに返す
    };
  }

  const validatedData = validationResult.data;

  const authResult = await getUserIdFromToken();
  if (authResult.error || !authResult.userId) {
    return {
      message: authResult.error || "認証に失敗しました。",
      success: false,
      fields: validatedData, // バリデーション済みのデータは保持
    };
  }

  try {
    await postInquiry(authResult.userId, validatedData);
    return {
      message: "登録しました",
      success: true,
      fields: {}, // 成功時はフォームをクリア
    };
  } catch (error: unknown) {
    console.error("Failed to post inquiry:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "不明なサーバーエラーが発生しました。";
    return {
      message: `登録に失敗しました: ${errorMessage}`,
      success: false,
      fields: validatedData, // 失敗時も入力内容は保持
    };
  }
}

const validateFormData = (formData: FormData) => {
  const dataToValidate = {
    inquiryCategoryId: formData.get("inquiryCategoryId"),
    unitIds: formData.getAll("unitIds"),
  };
  return InquiryPropertySchema.safeParse(dataToValidate);
};

const getUserIdFromToken = async (): Promise<{
  userId?: number;
  error?: string;
}> => {
  const cookie = await cookies();
  const token = cookie.get("session_token")?.value;
  if (!token) {
    return { error: "セッションが無効です。再度ログインしてください。" };
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
      userId: number;
    };
    return { userId: payload.userId };
  } catch (err) {
    console.error("JWT verification failed:", err);
    return {
      error: "セッションの有効期限が切れました。再度ログインしてください。",
    };
  }
};
