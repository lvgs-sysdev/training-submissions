import pool from "../../../shared/database/db.js";

export const toggleLike = async (postId: number, userId: number) => {
  //いいね済みか確認
  const [existing] = await pool.execute(
    "SELECT id FROM likes WHERE post_id = ? AND user_id = ?",
    [postId, userId],
  );

  const likes = existing as any[];

  if (likes.length > 0) {
    await pool.execute("DELETE FROM likes WHERE post_id = ? AND user_id = ?", [
      postId,
      userId,
    ]);
    return { liked: false };
  } else {
    await pool.execute("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", [
      postId,
      userId,
    ]);
    return { liked: true };
  }
};

export const getLikeCount = async (postId: number) => {
  const [rows] = await pool.execute(
    "SELECT COUNT(*) as count FROM likes WHERE post_id = ?",
    [postId],
  );
  return (rows as any)[0].count;
};
