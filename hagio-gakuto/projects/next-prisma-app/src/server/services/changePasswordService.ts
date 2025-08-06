import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";
import { changePasswordSchema } from "@/lib/validators/changePasswordValidator";

// Zodスキーマから型を推論
type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export async function changePassword(userId: number, data: ChangePasswordData) {
  const { currentPassword, newPassword } = data;
  // ここでユーザーの現在のパスワードを確認し、新しいパスワードに変更するロジックを実装
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }

  // 現在のパスワードが正しいか確認
  const isPasswordValid = await hash(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error("現在のパスワードが正しくありません");
  }

  // 新しいパスワードをハッシュ化
  const hashedNewPassword = await hash(newPassword, 10);

  // パスワードを更新
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  return updatedUser;
}
