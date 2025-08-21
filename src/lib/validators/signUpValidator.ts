import { z } from "zod";

export const SignUpSchema = z
  .object({
    name: z.string().min(1, "名前は必須です"),
    email: z
      .string()
      .email("正しいメール形式で入力してください")
      .min(1, "メールアドレスは必須です"),
    password: z
      .string()
      .min(1, "パスワードは必須です")
      .refine((val) => /^[ -~]+$/.test(val), {
        message:
          "パスワードは半角の英大文字、小文字、数字、記号のみ使用できます",
      })
      .refine((val) => val.length >= 8, {
        message: "8文字以上で入力してください",
      })
      .refine(
        (val) => {
          let count = 0;
          if (/[A-Z]/.test(val)) count++;
          if (/[a-z]/.test(val)) count++;
          if (/\d/.test(val)) count++;
          if (/[^A-Za-z0-9]/.test(val)) count++;
          return count >= 3;
        },
        {
          message:
            "英大文字、小文字、数字、記号のうち3種類以上を含めてください",
        }
      ),
    confirmPassword: z.string().min(1, "確認用パスワードは必須です"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"], // エラーをconfirmPasswordフィールドに関連付ける
  });

export type SignUpInput = z.infer<typeof SignUpSchema>;
