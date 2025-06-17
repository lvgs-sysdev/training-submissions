import { getNewArticle } from "../../../src/db/articleTable.js";

export const loadNewArticle = async (articleCount) => {
  const [raws, fields] = await getNewArticle(articleCount);
  return raws;
};
