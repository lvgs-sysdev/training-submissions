import { connectDb } from "./db.js";
import { formatDate } from "./article-card/formatDate.js";

export async function getArticleDataById(id) {
  if (!id) return null;
  let connection;
  try {
    connection = await connectDb();
    const [rows] = await connection.execute(
      "SELECT * FROM articles WHERE id = ?",
      [id]
    );
    if (!rows || !Array.isArray(rows) || rows.length === 0) return null;
    const article = rows[0];
    return {
      user_id: article.user_id,
      genre: article.genre,
      title: article.title,
      imgSrc: article.image1Url || "/src/hero-img.png",
      imgAlt: article.title,
      imgCaption: article.imgCaption || "",
      date: formatDate(article.createdAt),
      url: `/article/${article.id}`,
      body: `
        <p>${article.body1 || ''}</p>
        <div class="img-wrapper mb-50">
          <div class="img-box">
            <img src="${article.image1Url || '/src/hero-img.png'}" alt="${article.title}" />
          </div>
          <p class="img-caption">${article.imgCaption || ''}</p>
        </div>
        <p>${article.body2 || ''}</p>
        <p>${article.body3 || ''}</p>
        ${article.subHeading ? `<h3>${article.subHeading}</h3>` : ''}
        <p>${article.body4 || ''}</p>
        <p>${article.body5 || ''}</p>
        <div class="sub-img-wrapper mb-20">
          ${article.image2Url ? `<div class="sub-img-box mb-20"><img src="${article.image2Url}" alt="${article.title}"></div>` : ''}
          ${article.image3Url ? `<div class="sub-img-1-box mb-20"><img src="${article.image3Url}" alt="${article.title}"></div>` : ''}
        </div>
        <p>${article.body6 || ''}</p>
        <p>${article.body7 || ''}</p>
      `
    };
  } catch (e) {
    console.error("DB fetch error:", e);
    return null;
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * 関連記事を取得（同じgenre、かつ除外ID以外）
 * @param {string} genre
 * @param {number | null | undefined} [excludeId]
 * @returns {Promise<Array>}
 */
export async function getRelatedArticles(genre, excludeId = undefined) {
  let connection;
  try {
    connection = await connectDb();
    const [rows] = await connection.execute(
      `SELECT * FROM articles WHERE genre = ?`,
      [genre]
    );
    let filtered = rows;
    if (typeof excludeId === 'number') {
      filtered = rows.filter(article => Number(article.id) !== Number(excludeId));
    }
    return filtered.map((article) => ({
      title: article.title,
      date: formatDate(article.createdAt),
      genre: article.genre,
      body: article.body1 || '',
      imgSrc: article.image1Url || '/src/hero-img.png',
      imgAlt: article.title,
      url: `/article/${article.id}`
    }));
  } catch (e) {
    console.error("DB fetch error (getRelatedArticles):", e);
    return [];
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * 新着記事を取得（特定ID除外・件数指定）
 * @param {number} [limit=3]
 * @param {number | null | undefined} [excludeId]
 * @returns {Promise<Array>}
 */
export async function getNewArticles(limit = 3, excludeId = undefined) {
  let connection;
  try {
    connection = await connectDb();
    const [rows] = await connection.execute(
      `SELECT * FROM articles ORDER BY GREATEST(IFNULL(updatedAt, 0), IFNULL(createdAt, 0)) DESC`
    );
    let filtered = rows;
    if (typeof excludeId === 'number') {
      filtered = rows.filter(article => Number(article.id) !== Number(excludeId));
    }
    filtered = filtered.slice(0, limit);
    return filtered.map((article, idx) => ({
      date: formatDate(article.updatedAt || article.createdAt),
      genre: article.genre,
      body: article.title,
      imgSrc: article.image1Url || '/src/hero-img.png',
      imgAlt: `新着記事${idx + 1}`,
      url: `/article/${article.id}`
    }));
  } catch (e) {
    console.error("DB fetch error:", e);
    return [];
  } finally {
    if (connection) await connection.end();
  }
}
