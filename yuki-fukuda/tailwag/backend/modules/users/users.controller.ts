import type { FastifyRequest, FastifyReply } from "fastify";
import * as usersService from "./users.service.js";
import { getAllPosts } from "../feed/timeline/timeline.service.js";

export const getMe = async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.code(200).send({
    message: "ユーザー情報を取得しました",
    user: request.user,
  });
};

export const getUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const myId = (request.user as any).id;
    const targetUserId = parseInt((request.params as any).id);

    // 1. プロフィール情報（フォロー状況込み）を取得
    const profile = await usersService.getUserProfile(targetUserId, myId);

    if (!profile) {
      return reply.code(404).send({ message: "ユーザーが見つかりません" });
    }

    // 2. そのユーザーの投稿一覧を取得（既存のServiceを再利用！）
    const posts = await getAllPosts(targetUserId, myId);

    return reply.send({ profile, posts });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: "エラーが発生しました" });
  }
};

export const followUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const myId = (request.user as any).id;
  const targetUserId = parseInt((request.params as any).id);

  if (myId === targetUserId) {
    return reply.code(400).send({ message: "自分自身はフォローできません" });
  }

  const result = await usersService.toggleFollow(myId, targetUserId);
  return reply.send(result);
};
