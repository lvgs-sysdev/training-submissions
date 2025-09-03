"use server";

import { UpsertPropertySchema } from "@/lib/validators/upsertPropertyValidator";
import z from "zod";

// Zodスキーマから、フィールド名の型を動的に生成
type SchemaFields = z.infer<typeof UpsertPropertySchema>;

// FormStateの型を拡張して、フィールドごとのエラーと入力値を格納できるようにする
interface FormState {
  message: string | null;
  errors?: {
    [K in keyof SchemaFields]?: string[]; // 全てのフィールドのエラーを許容
  } & {
    _form?: string[]; // フォーム全体のエラー
  };
  success: boolean;
  fields?: Partial<SchemaFields>; // 全てのフィールドの入力値を許容
}

export async function propertyRegisterAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const result = UpsertPropertySchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  console.log(result);
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
    return {
      message: "登録しました",
      errors: {},
      success: true,
      fields: result.data,
    };
  } catch (e: any) {
    return {
      message: error.message,
      errors: {},
      success: false,
      fields: result.data,
    };
  }
}
