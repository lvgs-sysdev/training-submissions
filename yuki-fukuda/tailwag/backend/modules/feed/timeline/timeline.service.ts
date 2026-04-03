import db from "../../../shared/database/db.js";

interface PostRow {
  id: number;
  content: string;
  created_at: Date;
  account_name: string;
  breed_names: string | null;
  image_urls: string | null;
  like_count: number;
  is_liked: number;
}

export const getAllPosts = async (
  currentUserId: number,
  targetUserId?: number,
) => {
  const selectClause = `
    SELECT
    p.id,
    p.content,
    p.created_at,
    u.account_name,
   -- 犬種名を重複なく取得
      (SELECT GROUP_CONCAT(DISTINCT b.name)
       FROM post_breeds pb
       JOIN breeds b ON pb.breed_id = b.id
       WHERE pb.post_id = p.id) as breed_names,
      -- 画像URLを重複なく取得
      (SELECT GROUP_CONCAT(pi.image_url) 
       FROM post_images pi 
       WHERE pi.post_id = p.id) as image_urls,
      (SELECT COUNT(*) FROM likes Where post_id = p.id) as like_count,
      EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked
    FROM posts p
    JOIN users u ON p.user_id = u.id
    `;

  const params: any[] = [currentUserId];
  let whereClause = "";

  if (targetUserId) {
    whereClause = " WHERE p.user_id = ? ";
    params.push(targetUserId);
  }

  const finalQuery = `
    ${selectClause}
    ${whereClause}
    GROUP BY p.id
    ORDER BY p.created_at DESC;
    `;

  const [rows] = await db.execute(finalQuery, params);
  return (rows as PostRow[]).map((post) => ({
    ...post,
    user_name: post.account_name || "名無しさん",
    image_urls:
      post.image_urls && typeof post.image_urls === "string"
        ? post.image_urls.split(",")
        : [],
    breed_name: post.breed_names || "不明",
    like_count: post.like_count || 0,
    is_liked: Boolean(post.is_liked),
  }));
};
