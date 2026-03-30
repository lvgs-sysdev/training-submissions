import { getIronSession } from "iron-session";

export const prerender = false;

export async function POST({ cookies }) {
  const session = await getIronSession(cookies, {
    cookieName: "astro_session",
    password: import.meta.env.SESSION_SECRET,
    cookieOptions: {
      secure: import.meta.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    },
  });

  session.destroy();
  await session.save();
  console.log("セッション破棄確認:", session);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
