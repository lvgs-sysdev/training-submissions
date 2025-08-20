import { z } from "zod";

export const EditProfileSchema = z.object({
  email: z
    .string()
    .email("正しいメール形式で入力してください")
    .min(1, "メールアドレスは必須です"),
  name: z
    .string()
    .min(1, "ユーザー名は必須です")
    .refine((val) => val.length >= 2, {
      message: "2文字以上で入力してください",
    })
    .refine((val) => val.length <= 20, {
      message: "20文字以下で入力してください",
    }),
  avatar: z
    .instanceof(File)
    .optional()
    // ★ file.size === 0 の場合も許可する
    .refine(
      (file) => !file || file.size === 0 || file.size <= 5 * 1024 * 1024,
      {
        message: "ファイルサイズは5MB以下である必要があります",
      }
    )
    .refine(
      (file) => !file || file.size === 0 || file.type.startsWith("image/"),
      {
        message: "画像ファイルをアップロードしてください",
      }
    ),
});

export type EditProfileInput = z.infer<typeof EditProfileSchema>;
