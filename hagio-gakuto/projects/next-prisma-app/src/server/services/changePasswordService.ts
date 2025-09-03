import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { changePasswordSchema } from "@/lib/validators/changePasswordValidator";

// Zodスキーマから型を推論
type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export async function changePassword(userId: number, data: ChangePasswordData) {
  const { currentPassword, newPassword } = data;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }
  const isPasswordValid = await compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error("現在のパスワードが正しくありません");
  }
  const hashedNewPassword = await hash(newPassword, 10);
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  return updatedUser;
}
