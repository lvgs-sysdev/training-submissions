export default async function (pool) {
  const sql = `
    SELECT 
      a.title,
      a.content,
      a.article_id,
      a.created_at,
      a.image_path,
      t.tag_name,
      u.user_name
    FROM articles AS a 
    INNER JOIN tags AS t ON a.tag_id = t.tag_id 
    INNER JOIN users AS u ON a.user_id = u.user_id 
    ORDER BY a.created_at DESC
    LIMIT 6;`;
  const [rows] = await pool.execute(sql);
  return rows;
}
