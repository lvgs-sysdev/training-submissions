// 更新api
export const prerender = false;

import { connectDb } from '../../lib/db.js';
import fs from 'fs/promises';
import path from 'path';

async function saveImage(file) {
  if (!file || typeof file === 'string' || file.size === 0) {
    return null;
  }
  const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const savePath = path.join(process.cwd(), 'public', 'uploads', uniqueFilename);
  const urlPath = `/uploads/${uniqueFilename}`;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(savePath, buffer);
    return urlPath;
  } catch (error) {
    console.error(`画像ファイルの保存に失敗しました: ${file.name}`, error);
    return null;
  }
}


export async function POST({ request }) {
  let connection;

  try {
    const formData = await request.formData();
    const id = formData.get('id');
    if (!id) {
      return new Response(
        JSON.stringify({ message: "更新対象のIDがありません。" }),
        { status: 400 }
      );
    }

    // 仮: ユーザーIDをリクエストヘッダーから取得（本来はセッションやJWTから取得）
    const loginUserId = request.headers.get('x-user-id');
    if (!loginUserId) {
      return new Response(
        JSON.stringify({ message: "認証情報がありません。" }),
        { status: 401 }
      );
    }

    connection = await connectDb();

    let currentArticle = null;
    const [rows] = await connection.execute(
      'SELECT user_id, image1Url, image2Url, image3Url FROM articles WHERE id = ?',
      [id]
    );
    if (rows && Array.isArray(rows) && rows.length > 0) {
      currentArticle = rows[0];
    } else {
      throw new Error(`ID ${id} の記事が見つかりません。`);
    }

    // user_idチェック
    if (String(currentArticle.user_id) !== String(loginUserId)) {
      return new Response(
        JSON.stringify({ message: "このユーザーはこの記事を編集できません。" }),
        { status: 403 }
      );
    }

    const newImage1Url = await saveImage(formData.get('image1'));
    const newImage2Url = await saveImage(formData.get('image2'));
    const newImage3Url = await saveImage(formData.get('image3'));

    const sql = `
      UPDATE articles 
      SET
        genre = ?, title = ?, body1 = ?, 
        image1Url = ?, imgCaption = ?, body2 = ?, body3 = ?, 
        subHeading = ?, body4 = ?, body5 = ?, 
        image2Url = ?, image3Url = ?, body6 = ?, body7 = ?, tag = ?
      WHERE
        id = ?; 
    `;

    const values = [
      formData.get('genre'),
      formData.get('title'),
      formData.get('body1'),
      // @ts-ignore
      newImage1Url || currentArticle.image1Url,
      formData.get('img-caption'),
      formData.get('body2'),
      formData.get('body3'),
      formData.get('sub-heading'),
      formData.get('body4'),
      formData.get('body5'),
      // @ts-ignore
      newImage2Url || currentArticle.image2Url,
      // @ts-ignore
      newImage3Url || currentArticle.image3Url,
      formData.get('body6'),
      formData.get('body7'),
      formData.get('tag'),
      id
    ];

    // SQL 実行
    await connection.execute(sql, values);

    return new Response(
      JSON.stringify({ message: "更新に成功しました" }),
      { status: 200 }
    );

  } catch (error) {
    console.error('DBエラー (更新):', error);
    return new Response(
      JSON.stringify({ message: "更新に失敗しました", error: error.message }),
      { status: 500 }
    );

  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
