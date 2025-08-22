import { z } from "zod";

export const DeleteAccountSchema = z
  .object({
    password: z.string().min(1, "パスワードは必須です"),
    confirmPassword: z.string().min(1, "パスワードの確認は必須です"),
  })
  // 複数のフィールド相関チェックはsuperRefineが便利
  .superRefine((data, ctx) => {
    // passwordとconfirmPasswordが「同じでないか」をチェック
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "新しいパスワードと一致しません",
        path: ["confirmPassword"],
      });
    }
  });

export type ChangePasswordInput = z.infer<typeof DeleteAccountSchema>;
