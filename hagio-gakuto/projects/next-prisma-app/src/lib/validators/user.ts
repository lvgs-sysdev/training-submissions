import { z } from "zod";
export const RegisterSchema = z.object({
  name: z.string().min(1, "名前は必須"),
  email: z.string().email("正しいメール形式を入力してください"),
  password: z.string().min(6, "パスワードは6文字以上"),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;
