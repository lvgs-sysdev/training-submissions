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
  //JWTからユーザーIDを取得
  const userId = (request.user as any).id;

  //マルチパートデータ
  const parts = request.parts();
  let content = "";
  let breedIds: number[] = [];
  const imageUrls: string[] = [];

  try {
    for await (const part of parts) {
      if (part.type === "file") {
        //画像ファイルの処理
        const fileName = `post-${Date.now()}-${part.filename}.webp`;
        const uploadPath = path.resolve(
          __dirname,
          "../../../../public/uploads",
          fileName,
        );

        console.log("実際に保存しようとしているフルパス:", uploadPath);

        const buffer = await part.toBuffer();
        await sharp(buffer)
          .resize(1200)
          .webp({ quality: 80 })
          .toFile(uploadPath);

        imageUrls.push(`/uploads/${fileName}`);
      } else {
        if (part.fieldname === "content") {
          content = part.value as string;
        }
        if (part.fieldname === "breed_ids") {
          //フロントからJSON文字列で送る
          breedIds = JSON.parse(part.value as string);
        }
      }
    }

    if (!content && imageUrls.length === 0) {
      return reply.code(400).send({ message: "内容または写真を投稿してね" });
    }
    //Serviceを呼び出してDBに保存
    const postId = await postService.createPostWithImages(
      userId,
      content,
      breedIds,
      imageUrls,
    );

    return reply.code(201).send({ message: "写真付きで投稿完了!", postId });
  } catch (error) {
    request.log.error(error);
    // 失敗した場合、既に保存してしまった画像ファイルを削除する処理（クリーンアップ）を後で入れる
    return reply.code(500).send({ message: "投稿に失敗しました" });
  }
};
