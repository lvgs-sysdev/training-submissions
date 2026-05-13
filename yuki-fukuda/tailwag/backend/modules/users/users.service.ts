import pool from "../../shared/database/db.js";

export const getUserProfile = async (targetUserId: number, myId: number) => {
  const sql = `
    SELECT 
      u.id, 
      u.account_id, 
      u.account_name, 
      u.profile_content, 
      u.profile_image_url,
      (SELECT COUNT(*) FROM follows WHERE following_user_id = u.id) as following_count,
      (SELECT COUNT(*) FROM follows WHERE followed_user_id = u.id) as followers_count,
      -- 💡 自分がこの人をフォローしているかどうかのフラグ
      EXISTS(
        SELECT 1 FROM follows 
        WHERE following_user_id = ? AND followed_user_id = ?
      ) as is_following
    FROM users u
    WHERE u.id = ?
  `;

  const [rows] = await pool.execute(sql, [myId, targetUserId, targetUserId]);
  return (rows as any[])[0];
};

export const toggleFollow = async (myId: number, targetId: number) => {
  // 1. すでにフォローしているかチェック
  const [existing] = await pool.execute(
    "SELECT id FROM follows WHERE following_user_id = ? AND followed_user_id = ?",
    [myId, targetId],
  );

  const isFollowing = (existing as any[]).length > 0;

  if (isFollowing) {
    // 2. フォロー済みなら解除
    await pool.execute(
      "DELETE FROM follows WHERE following_user_id = ? AND followed_user_id = ?",
      [myId, targetId],
    );
    return { followed: false };
  } else {
    // 3. 未フォローなら登録
    await pool.execute(
      "INSERT INTO follows (following_user_id, followed_user_id) VALUES (?, ?)",
      [myId, targetId],
    );
    return { followed: true };
  }
};
