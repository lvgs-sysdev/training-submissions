'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Header() {
  const { status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentUrl = searchParams.size > 0
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  const loginUrl = `/auth/signin?callbackUrl=/auth/post-signin?callbackUrl=${encodeURIComponent(currentUrl)}`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-16 min-h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white bg-opacity-95 backdrop-blur">
      {/* ロゴは常時表示 */}
      <Link href="/" className="no-underline text-[20px] font-bold text-[#d9534f]">
        Taberogu Clone
      </Link>

      {/* ナビゲーション（状態によって中身が変わる） */}
      <nav className="flex items-center gap-5 h-full">
        {isLoading ? (
          // ローディング中（スケルトン表示）
          <div className="h-6 w-24 bg-white rounded animate-pulse" />
        ) : isAuthenticated ? (
          // ログイン済み
          <>
            <Link href="/my/restaurants" className="no-underline font-bold text-[#d9534f]">
              My Page
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="no-underline cursor-pointer font-thin text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </>
        ) : (
          // 未ログインとサインイン画面では表示しない
          pathname !== '/auth/signin' && (
            <Link href={loginUrl} className="no-underline text-[#d9534f]">
              Login / Register
            </Link>
          )
        )}
      </nav>
    </header>
  );
}
