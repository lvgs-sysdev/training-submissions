import { getNewArticle } from "../db/articleTable.js";

export const loadNewArticle = async (articleCount) => {
  const [raws, fields] = await getNewArticle(articleCount);
  return raws;
};
