import db from "../../../shared/database/db.js";

interface PostRow {
  id: number;
  content: string;
  created_at: Date;
  account_name: string;
  profile_image_url: string | null;
  breed_names: string | null;
  image_urls: string | null;
  like_count: number;
  is_liked: number;
  user_id: number;
}

export const getAllPosts = async (
  currentUserId: number,
  targetUserId?: number,
  search?: string,
) => {
  // 💡 パラメータの配列。最初は 'is_liked' 用の currentUserId
  const params: any[] = [currentUserId];
  const whereConditions: string[] = [];

  // 1. 特定ユーザーの絞り込み（マイページなど）
  if (targetUserId) {
    whereConditions.push("p.user_id = ?");
    params.push(targetUserId);
  }

  // 2. 検索ワードによる絞り込み
  if (search && search.trim() !== "") {
    const s = `%${search}%`;
    whereConditions.push(`(
      u.account_name LIKE ? OR 
      p.content LIKE ? OR 
      p.id IN (SELECT pb.post_id FROM post_breeds pb JOIN breeds b ON pb.breed_id = b.id WHERE b.name LIKE ?)
    )`);
    params.push(s, s, s); // 3つの '?' に対して3つ追加
  }

  const whereClause =
    whereConditions.length > 0 ? " WHERE " + whereConditions.join(" AND ") : "";

  // 💡 SELECT文の ? と WHERE句の ? の順番を固定する
  const finalQuery = `
    SELECT
      p.id, p.user_id, p.content, p.created_at,
      u.account_name, u.profile_image_url,
      (SELECT GROUP_CONCAT(DISTINCT b.name) FROM post_breeds pb JOIN breeds b ON pb.breed_id = b.id WHERE pb.post_id = p.id) as breed_names,
      (SELECT GROUP_CONCAT(pi.image_url) FROM post_images pi WHERE pi.post_id = p.id) as image_urls,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
      EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ${whereClause}
    GROUP BY p.id
    ORDER BY p.created_at DESC;
  `;

  // デバッグ用（ターミナルで確認してみて！）
  console.log("SQL:", finalQuery);
  console.log("PARAMS:", params);

  const [rows] = await db.execute(finalQuery, params);

  // ... あとの return 部分は変更なし
  return (rows as PostRow[]).map((post) => ({
    ...post,
    user_name: post.account_name || "名無しさん",
    profile_image_url: post.profile_image_url,
    image_urls:
      post.image_urls && typeof post.image_urls === "string"
        ? post.image_urls.split(",")
        : [],
    breed_name: post.breed_names || "不明",
    like_count: post.like_count || 0,
    is_liked: Boolean(post.is_liked),
  }));
};
