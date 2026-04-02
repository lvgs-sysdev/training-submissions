import GetLatestArticles from "../model/articlesModel.js";

export const indexGET = async function (request, reply) {
  const userName = request.getUserName();

  const articlelist = await GetLatestArticles(request.server.toppagePool);

  return reply.view("public/index.ejs", {
    userName,
    articlelist,
  });
};
