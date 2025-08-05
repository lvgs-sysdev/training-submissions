import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email("正しいメール形式で入力してください")
    .min(1, "メールアドレスは必須です"),
  password: z
    .string()
    .min(1, "パスワードは必須です")
    .refine((val) => val.length >= 8, {
      message: "8文字以上で入力してください",
    }),
});

export type LoginInput = z.infer<typeof LoginSchema>;
