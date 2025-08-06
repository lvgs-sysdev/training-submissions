"use server";

import { EditProfileSchema } from "@/lib/validators/editProfileValidator";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { editProfile } from "@/server/services/editProfileService";

interface FormState {
  message: string | null;
  errors?: {
    avatar?: string[];
    email?: string[];
    name?: string[];
  };
  success: boolean;
  fields?: {
    avatar?: File | null;
    email?: string;
    name?: string;
  };
}

export async function editProfileAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log("editProfileAction called with formData:", formData);
  const result = EditProfileSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

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
    await editProfile(userId, result.data);
    return {
      message: "プロフィールが変更されました。",
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
