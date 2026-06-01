import { NextResponse } from "next/server";

// 指定がなければ自動的に500
// 500エラー以外の場合はAPI側で、return handleApiError(null, "ID must be a number", 400);等と書く
export function handleApiError(
  error: any,
  message: string,
  status: number = 500
) {
  // 500番台だけlogがほしい
  if (status >= 500) {
    console.error(`SERVER ERROR [${message}]:`, error);
  }

  return NextResponse.json({ error: message }, { status: status });
}
