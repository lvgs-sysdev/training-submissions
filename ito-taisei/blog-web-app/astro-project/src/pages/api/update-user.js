import { connectDb } from "../../lib/db.js";
import { serialize } from "cookie";

export const prerender = false;

export async function POST(Astro) {
  const formData = await Astro.request.formData();
  const id = formData.get("id");
  const user_id = formData.get("user_id");
  const user_name = formData.get("user_name");

  if (!id || !user_id || !user_name) {
    return new Response(JSON.stringify({ error: "全ての項目が必須です。" }), { status: 400 });
  }

  let connection;
  try {
    connection = await connectDb();
    // まず現在のuser_idを取得
    const [userRows] = await connection.execute(
      "SELECT user_id FROM users WHERE id = ?",
      [id]
    );
    const oldUserId = userRows && userRows[0] ? userRows[0].user_id : null;
    // usersテーブルを更新
    await connection.execute(
      "UPDATE users SET user_id = ?, user_name = ? WHERE id = ?",
      [user_id, user_name, id]
    );
    // articlesテーブルのuser_idも一括更新
    if (oldUserId && oldUserId !== user_id) {
      await connection.execute(
        "UPDATE articles SET user_id = ? WHERE user_id = ?",
        [user_id, oldUserId]
      );
    }
    // astro_session Cookieも新しいuser_idで再発行
    const sessionCookie = serialize("astro_session", JSON.stringify({ user_id, id }), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Set-Cookie": sessionCookie,
        "Content-Type": "application/json"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "更新に失敗しました。" }), { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
