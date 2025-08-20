import { writeFile } from "fs/promises";
import path from "path";

/**
 * アバターファイルを保存し、公開URLパスを返す
 * @param userId ユーザーID
 * @param avatar Fileオブジェクト
 * @returns データベースに保存するためのURLパス (例: /images/avatars/avatar_1_12345.jpg)
 */
export async function saveAvatar(
  userId: number,
  avatar: File
): Promise<string> {
  // 1. ファイルのバイナリデータを読み込む
  const bytes = await avatar.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 2. ユニークなファイル名を生成
  const extension = path.extname(avatar.name);
  const newFileName = `avatar_${userId}_${Date.now()}${extension}`;

  // 3. 保存先のフルパスを決定
  const savePath = path.join(
    process.cwd(),
    "public/images/avatars",
    newFileName
  );

  // 4. ファイルを書き込む
  await writeFile(savePath, buffer);

  // 5. DBに保存する用のパスを返す
  return `/images/avatars/${newFileName}`;
}
