import type { FastifyRequest, FastifyReply } from "fastify";
import * as mypageService from "./mypage.service.js";
import { getAllPosts } from "../feed/timeline/timeline.service.js";

export const getMyPageHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const userId = (request.user as any).id;
    //プロフィール情報の取得
    const profile = await mypageService.getMyProfile(userId);
    //自分の投稿の取得
    const myPosts = await getAllPosts(userId, userId);

    return reply.send({
      profile,
      posts: myPosts,
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ message: "マイページの取得に失敗しました" });
  }
};
