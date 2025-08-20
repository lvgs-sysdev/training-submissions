import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "現在のパスワードは必須です"),

    // ★ フィールド名を "newPassword" に変更
    newPassword: z
      .string()
      .min(1, "新しいパスワードは必須です")
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

    // ★ "confirmPassword" フィールドを定義
    confirmPassword: z.string().min(1, "パスワードの確認は必須です"),
  })
  // 複数のフィールド相関チェックはsuperRefineが便利
  .superRefine((data, ctx) => {
    // ★ 修正点1: newPasswordとcurrentPasswordが「同じでないか」をチェック
    if (data.newPassword === data.currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "新しいパスワードは現在のパスワードと異なる必要があります",
        path: ["newPassword"], // エラーはnewPasswordフィールドに表示
      });
    }

    // ★ 修正点2: newPasswordとconfirmPasswordが「一致するか」をチェック
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "新しいパスワードと一致しません",
        path: ["confirmPassword"],
      });
    }
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
