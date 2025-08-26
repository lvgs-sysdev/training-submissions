import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { z } from "zod";
import { LoginSchema } from "@/lib/validators/loginValidator";
import jwt from "jsonwebtoken"; // ★ 1. jsonwebtokenをインポート

type LoginData = z.infer<typeof LoginSchema>;

export async function login(data: LoginData) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("メールアドレス、もしくはパスワードが正しくありません");
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    throw new Error("メールアドレス、もしくはパスワードが正しくありません");
  }

  // ★ 2. パスワード検証成功後、JWTを生成する
  const payload = { userId: user.id, name: user.name };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1h",
  });



  // ★ 3. ユーザーオブジェクトではなく、生成したトークンを返す
  return token;
}
