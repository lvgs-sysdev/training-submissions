import { getIronSession } from "iron-session";
import { sessionOptions } from "./lib/sessionOptions.js";

export async function onRequest(context, next) {
  const { request, cookies, locals } = context;
  // iron-sessionでセッションを取得し、Astro.localsに格納
  locals.session = await getIronSession(request, cookies, sessionOptions);
  return next();
}
