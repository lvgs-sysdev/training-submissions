export const prerender = false;

import { getIronSession } from "iron-session";
import bcrypt from "bcrypt";
import { connectDb } from "../../lib/db.js";

export async function POST({ request, cookies }) {
  const formData = await request.formData();
  const user_id = formData.get("user_id");
  const password = formData.get("password");

  let connection;
  try {
    connection = await connectDb();
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id]
    );

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ error: "ユーザーIDまたはパスワードが違います。" }), { status: 401 });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "ユーザーIDまたはパスワードが違います。" }), { status: 401 });
    }

    // セッションに保存
    const session = await getIronSession(cookies, {
      cookieName: "astro_session",
      password: import.meta.env.SESSION_SECRET,
      cookieOptions: {
        secure: import.meta.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      },
    });
    session.user = { user_id: user.user_id, id: user.id };
    await session.save();

    return new Response(JSON.stringify({ success: true, user_id: user.user_id }), { status: 200 });

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "サーバーエラー" }), { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
