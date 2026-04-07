import pool from "../../shared/database/db.js";

export const toggleFollow = async (myId: number, targetId: number) => {
  //フォローしているかチェック
  const [existing] = await pool.execute(
    "SELECT id FROM follows WHERE following_user_id = ? AND followed_user_id = ?",
    [myId, targetId],
  );

  if ((existing as any[]).length > 0) {
    //フォロー済みなら解除
    await pool.execute(
      "DELETE FROM follows WHERE following_user_id =? AND followed_user_id =?",
      [myId, targetId],
    );
    return { followed: false };
  } else {
    //未フォローなら登録
    await pool.execute(
      "INSERT INTO follows (following_user_id, followed_user_id) VALUES(?, ?)",
      [myId, targetId],
    );
    return { followed: true };
  }
};
