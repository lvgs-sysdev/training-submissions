import { getIronSession } from "iron-session";

export async function getLoginUserFromSession(cookies) {
  const session = await getIronSession(cookies, {
    cookieName: "astro_session",
    password: import.meta.env.SESSION_SECRET,
    cookieOptions: {
      secure: import.meta.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    },
  });

  return session.user || null;
}

export async function getLoginUserIdFromSession(cookies) {
  const user = await getLoginUserFromSession(cookies);
  return user?.user_id || null;
}

export { getIronSession };
