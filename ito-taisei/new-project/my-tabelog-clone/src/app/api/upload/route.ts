import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    // バッファ取得
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'ファイルがありません' }, { status: 400 });
    }
    // 拡張子・サイズチェック
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowed = ['jpg', 'jpeg', 'png'];
    if (!ext || !allowed.includes(ext)) {
      return NextResponse.json({ error: '画像はjpgまたはpng形式のみアップロードできます' }, { status: 400 });
    }
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: '画像サイズは2MB以下にしてください' }, { status: 400 });
    }
    // ファイル名生成
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    // ファイル保存
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    // 公開URL返却
    const url = `/uploads/${fileName}`;
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: 'アップロード失敗' }, { status: 500 });
  }
}
