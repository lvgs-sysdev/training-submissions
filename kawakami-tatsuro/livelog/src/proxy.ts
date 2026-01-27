import { NextRequest, NextResponse } from "next/server"

const pathForNotLoggedInUsers = ['/login', '/register']
const pathForLoggedInUsers = ['/post', '/account']

export const proxy = (request: NextRequest) => {
  const accessToken = request.cookies.get('access_token')
  const pathname = request.nextUrl.pathname

  if (request.method === 'POST') return NextResponse.next()

  // ログインが必要なページ（トークンがなければログインページにリダイレクト）
  if (pathForLoggedInUsers.some(path => pathname === path || pathname.startsWith(`${path}/`))){
    return accessToken ? NextResponse.next() : NextResponse.redirect(new URL('/login', request.url))
  }

  // 未ログインユーザー向けのページ（トークンがあればトップページにリダイレクト）
  if (pathForNotLoggedInUsers.some(path => pathname === path || pathname.startsWith(`${path}/`))){
    return accessToken ? NextResponse.redirect(new URL('/', request.url)) : NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
// 以下のパスへのリクエストがあった場合のみmiddlewareを実行する
  matcher: ['/login', '/register', '/post', '/post/edit/:path*', '/account/:path*']
}
