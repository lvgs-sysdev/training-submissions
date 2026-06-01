import { getIronSession } from "iron-session";
import { sessionOptions } from "/src/lib/sessionOptions.js";

export async function onRequest(context) {
  const { request, cookies, locals } = context;
  console.log("middleware called", { localsExists: !!locals });
  if (locals) {
    locals.session = await getIronSession(request, cookies, sessionOptions);
  } else {
    console.log("[middleware] locals is undefined!");
  }
  return context.next();
}
