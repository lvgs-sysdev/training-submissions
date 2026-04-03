import db from "../../shared/database/db.js";

export const getMyProfile = async (userId: number) => {
  const query = `
    SELECT
    id,
    account_name,
    account_id,
    profile_image_url,
    profile_content,
    email,
    -- フォロー数
    (SELECT COUNT(*) FROM follows WHERE following_user_id = u.id) as following_count,
    -- フォロワー数
    (SELECT COUNT(*) FROM follows WHERE followed_user_id = u.id) as followers_count
    FROM users u
    WHERE u.id =?;
    `;
  const [rows] = await db.execute(query, [userId]);
  const user = (rows as any[])[0];
  return user;
};
