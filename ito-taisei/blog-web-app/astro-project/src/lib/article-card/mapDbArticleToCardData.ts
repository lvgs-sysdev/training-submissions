import type { ArticleData } from "../../types";

export function mapDbArticleToCardData(article: any): ArticleData {
  return {
    imgSrc: article.image1Url || "/src/hero-img.png",
    imgAlt: article.title,
    date: article.createdAt,
    genre: article.genre,
    title: article.title,
    body: article.body1 || "",
    url: `/article/${article.id}`,
  };
}
