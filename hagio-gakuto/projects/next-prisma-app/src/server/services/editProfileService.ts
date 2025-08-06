import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { EditProfileSchema } from "@/lib/validators/editProfileValidator";
import { saveAvatar } from "./fileService"; // ★ 作成したヘルパーをインポート

type EditProfileData = z.infer<typeof EditProfileSchema>;

export async function editProfile(userId: number, data: EditProfileData) {
  const { name, email, avatar } = data;

  let avatarUrl: string | undefined;

  // 新しいアバターファイルがあれば、保存処理をヘルパーに任せる
  if (avatar && avatar.size > 0) {
    avatarUrl = await saveAvatar(userId, avatar);
  }

  // データベースを更新
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      // avatarUrlに新しい値があれば、DBのavatar_urlを更新
      ...(avatarUrl && { avatar_url: avatarUrl }),
    },
  });

  return updatedUser;
}
