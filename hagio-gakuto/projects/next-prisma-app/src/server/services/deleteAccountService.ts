import { prisma } from "@/lib/prisma";
import { z } from "zod";

import { DeleteAccountSchema } from "@/lib/validators/deleteAccountValidator";
import { hash } from "crypto";
import { compare } from "bcryptjs";

type DeleteAccountData = z.infer<typeof DeleteAccountSchema>;

export async function deleteAccount(userId: number, data: DeleteAccountData) {
  const { password } = data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  console.log("User found:", user);
  // 現在のパスワードが正しいか確認
  const isPasswordValid = await compare(password, user.password);
  console.log("Is password valid:", isPasswordValid);
  if (!isPasswordValid) {
    throw new Error("現在のパスワードが正しくありません");
  }
  // ユーザーを削除
  const deletedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      is_deleted: true,
    },
  });

  return deletedUser;
}
