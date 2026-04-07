import db from "../../shared/database/db.js";

// mypage.service.ts

export const getMyProfile = async (
  targetUserId: number,
  currentUserId: number,
) => {
  const query = `
    SELECT
      id, account_name, account_id, profile_image_url, profile_content, email,
      (SELECT COUNT(*) FROM follows WHERE following_user_id = u.id) as following_count,
      (SELECT COUNT(*) FROM follows WHERE followed_user_id = u.id) as followers_count,
      -- 💡 閲覧者が対象をフォローしているか
      EXISTS(SELECT 1 FROM follows WHERE following_user_id = ? AND followed_user_id = u.id) as is_following
    FROM users u
    WHERE u.id = ?;
  `;
  const [rows] = await db.execute(query, [currentUserId, targetUserId]);
  const user = (rows as any[])[0];

  if (user) {
    user.is_following = Boolean(user.is_following);
  }
  return user;
};

export const updateProfile = async (
  currentUserId: number,
  accountName: string,
  profileContent: string,
  profileImageUrl?: string,
) => {
  let sql: string;
  let params: any[];

  if (profileImageUrl) {
    sql = `UPDATE users SET account_name = ?, profile_content = ?, profile_image_url = ? WHERE id = ?`;
    params = [accountName, profileContent, profileImageUrl, currentUserId];
  } else {
    sql = `UPDATE users SET account_name = ?, profile_content = ? WHERE id = ?`;
    params = [accountName, profileContent, currentUserId];
  }

  await db.execute(sql, params);
};
