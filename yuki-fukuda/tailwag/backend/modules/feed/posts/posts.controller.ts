import type { FastifyRequest, FastifyReply } from "fastify";
import * as postService from "./posts.service.js";
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPost = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = (request.user as any).id;

  // 1. ファイルを一時保存する（複数枚対応の肝）
  const files = await request.saveRequestFiles();

  // 2. テキストデータは request.body から取得する
  // fastify-multipart の attachFieldsToBody: true を使っている場合に有効
  const body = request.body as any;

  // body.fieldname.value で値が取れます。存在しない場合を考慮してガードを入れます。
  let content = body.content?.value || "";
  let breedIds: number[] = [];

  try {
    if (body.breed_ids?.value) {
      breedIds = JSON.parse(body.breed_ids.value);
    }

    const imageUrls: string[] = [];

    // 3. 一時保存されたファイルをループして Sharp で加工・保存
    for (const file of files) {
      const fileName = `post-${Date.now()}-${Math.floor(Math.random() * 1000)}.webp`;
      const uploadPath = path.join("/app/uploads", fileName);

      await sharp(file.filepath)
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(uploadPath);

      imageUrls.push(`/uploads/${fileName}`);
    }

    if (!content.trim() && imageUrls.length === 0) {
      return reply.code(400).send({ message: "内容または写真を投稿してね" });
    }

    // 4. Service を呼んで DB 保存
    const postId = await postService.createPostWithImages(
      userId,
      content,
      breedIds,
      imageUrls,
    );

    return reply.code(201).send({ message: "投稿完了！🐾", postId });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: "投稿に失敗しました" });
  }
};
