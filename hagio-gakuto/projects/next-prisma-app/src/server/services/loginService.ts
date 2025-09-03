import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { z } from "zod";
import { LoginSchema } from "@/lib/validators/loginValidator";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userWithRole = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { role: true },
});
type UserWithRole = Prisma.UserGetPayload<typeof userWithRole>;
type LoginData = z.infer<typeof LoginSchema>;

/**
 * ログイン処理のメイン関数
 * @param data - メールアドレスとパスワードを含むログインデータ
 * @returns 認証が成功した場合はJWT文字列
 */
export async function login(data: LoginData): Promise<string> {
  const { email, password } = data;
  const user = await findAndValidateUser(email, password);
  const token = generateAuthToken(user);
  return token;
}

async function findAndValidateUser(
  email: string,
  password: string
): Promise<UserWithRole> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
    },
  });
  await validateCredentials(user, password);
  return user!;
}

async function validateCredentials(
  user: UserWithRole | null,
  password: string
): Promise<void> {
  if (!user) {
    throw new Error("メールアドレス、もしくはパスワードが正しくありません");
  }
  const isValidPassword = await compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("メールアドレス、もしくはパスワードが正しくありません");
  }
}

function generateAuthToken(user: UserWithRole): string {
  const payload = {
    userId: user.id,
    name: user.name,
    role: user.roleId,
  };
  validateSecretKey();
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    expiresIn: "1h", // トークンの有効期限
  });
  return token;
}

function validateSecretKey() {
  if (!process.env.JWT_SECRET_KEY) {
    console.error("JWT_SECRET_KEY is not set.");
    throw new Error("Authentication configuration error.");
  }
}
