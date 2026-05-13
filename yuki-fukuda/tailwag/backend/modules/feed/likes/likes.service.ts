import pool from "../../../shared/database/db.js";

export const toggleLike = async (postId: number, userId: number) => {
  // 1. いいね済みか確認
  const [existing] = await pool.execute(
    "SELECT id FROM likes WHERE post_id = ? AND user_id = ?",
    [postId, userId],
  );

  const likes = existing as any[];
  let liked = false;

  if (likes.length > 0) {
    // 解除
    await pool.execute("DELETE FROM likes WHERE post_id = ? AND user_id = ?", [
      postId,
      userId,
    ]);
    liked = false;
  } else {
    // 追加
    await pool.execute("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", [
      postId,
      userId,
    ]);
    liked = true;
  }

  // 💡 2. 最新のいいね数を取得（ここが重要！）
  const [countRows] = await pool.execute(
    "SELECT COUNT(*) as count FROM likes WHERE post_id = ?",
    [postId],
  );
  const count = (countRows as any)[0].count;

  // 💡 3. liked状態と最新カウントをセットで返す
  return { liked, count };
};
