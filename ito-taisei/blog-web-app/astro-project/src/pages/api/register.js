// 新規登録api
import { validateUserForm } from "../../lib/validation.js";
import { connectDb } from "../../lib/db.js";
import bcrypt from "bcrypt";

export const prerender = false;

export async function POST({ request }) {
  const formData = await request.formData();
  const user_name = formData.get('user_name');
  const user_id = formData.get('user_id');
  const password = formData.get('password');

  const error = validateUserForm({ user_name, user_id, password });
  if (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }

  let connection;
  try {
    connection = await connectDb();
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id]
    );
    if (rows && rows.length > 0) {
      return new Response(JSON.stringify({ error: "このユーザーIDは既に登録されています。" }), { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await connection.execute(
      "INSERT INTO users (user_name, user_id, password) VALUES (?, ?, ?)",
      [user_name, user_id, password_hash]
    );

    return new Response(JSON.stringify({ success: true, user_id }), { status: 201 });

  } catch (e) {
    return new Response(JSON.stringify({ error: "サーバーエラー" }), { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
