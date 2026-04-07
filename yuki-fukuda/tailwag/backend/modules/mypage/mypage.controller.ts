import type { FastifyRequest, FastifyReply } from "fastify";
import * as mypageService from "./mypage.service.js";
import { getAllPosts } from "../feed/timeline/timeline.service.js";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// mypage.controller.ts

export const getMyPageHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const currentUserId = (request.user as any).id;

    const { id } = request.params as { id?: string };
    const { userId } = request.query as { userId?: string };

    // 数値に変換。どちらもなければ自分のID
    const targetUserId = id
      ? Number(id)
      : userId
        ? Number(userId)
        : currentUserId;
    console.log(
      `Fetching profile for targetUserId: ${targetUserId}, by currentUserId: ${currentUserId}`,
    );

    // 1. プロフィール情報の取得 (引数は target, current の順)
    const profile = await mypageService.getMyProfile(
      targetUserId,
      currentUserId,
    );

    // プロフィールが見つからない場合のガード
    if (!profile) {
      return reply
        .code(404)
        .send({ message: "ユーザーが見つかりませんでした" });
    }

    // 2. 投稿の取得
    const targetPosts = await getAllPosts(
      currentUserId,
      targetUserId,
      undefined,
    );

    return reply.send({
      profile,
      posts: targetPosts,
    });
  } catch (error) {
    console.error("getMyPageHandler Error:", error);
    return reply.code(500).send({ message: "マイページの取得に失敗しました" });
  }
};

export const updateProfileHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = (request.user as any).id;
    const body = request.body as any;

    console.log("📥 受信データ一覧:", Object.keys(body)); // 💡 どんなキーが届いているか確認

    const accountName = body.account_name?.value || "";
    const profileContent = body.profile_content?.value || "";
    let profileImageUrl: string | undefined = undefined;

    // 💡 body.profile_image が存在するかチェック
    const filePart = body.profile_image;

    if (filePart && filePart.filename) {
      console.log("📸 画像を検出しました:", filePart.filename);

      const fileName = `profile-${userId}-${Date.now()}.webp`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const uploadPath = path.join(uploadDir, fileName);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const buffer = await filePart.toBuffer();
      await sharp(buffer)
        .resize(400, 400, { fit: "cover" })
        .webp({ quality: 80 })
        .toFile(uploadPath);

      profileImageUrl = `/uploads/${fileName}`;
      console.log("✅ 画像保存成功:", profileImageUrl);
    } else {
      console.log("⚠️ 画像が検出されませんでした。保存処理をスキップします。");
    }

    await mypageService.updateProfile(
      userId,
      accountName,
      profileContent,
      profileImageUrl,
    );
    return reply.code(200).send({ message: "プロフィールを更新しました🐾" });
  } catch (error) {
    console.error("❌ updateProfileHandlerでエラー:", error);
    return reply.code(500).send({ message: "更新に失敗しました" });
  }
};
