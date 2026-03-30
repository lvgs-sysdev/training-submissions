// 新規保存api
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


export async function POST({ request, cookies }) {
  let connection;


  try {
    // クッキーからuser_idを取得
    const sessionCookie = cookies.get("astro_session")?.value;
    let user_id = null;
    if (sessionCookie) {
      try {
        user_id = JSON.parse(sessionCookie).user_id;
      } catch (e) {}
    }
    if (!user_id) {
      return new Response(JSON.stringify({ error: "ログイン情報がありません" }), { status: 401 });
    }

    const formData = await request.formData();
    const image1Url = await saveImage(formData.get('image1'));
    const image2Url = await saveImage(formData.get('image2'));
    const image3Url = await saveImage(formData.get('image3'));

    connection = await connectDb();

    const sql = `
      INSERT INTO articles (
      user_id, genre, title, body1, 
      image1Url, imgCaption, body2, body3, 
      subHeading, body4, body5, 
      image2Url, image3Url, body6, body7, tag
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      user_id,
      formData.get('genre'),
      formData.get('title'),
      formData.get('body1'),
      image1Url,
      formData.get('img-caption'),
      formData.get('body2'),
      formData.get('body3'),
      formData.get('sub-heading'),
      formData.get('body4'),
      formData.get('body5'),
      image2Url,
      image3Url,
      formData.get('body6'),
      formData.get('body7'),
      formData.get('tag')
    ];

    await connection.execute(sql, values);

    return new Response(
      JSON.stringify({ message: "新規保存に成功しました" }),
      { status: 200 }
    );

  } catch (error) {
    console.error('DBエラー:', error);
    return new Response(
      JSON.stringify({ message: "新規保存に失敗しました", error: error.message }),
      { status: 500 }
    );

  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
