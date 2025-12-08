// グローバルヘッダー
'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <header className="fixed top-0 left-0 w-full z-50 h-16 min-h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white bg-opacity-95 backdrop-blur">
        {/* skeleton */}
      </header>
    );
  }

  const isAuthenticated = status === 'authenticated';

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-16 min-h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white bg-opacity-95 backdrop-blur">
      <Link href="/" className="no-underline text-[20px] font-bold text-[#d9534f]">
        Taberogu Clone
      </Link>

      <nav className="flex items-center gap-5 h-full">
        {isAuthenticated ? (
          <>
            <Link href="/my/restaurants" className="no-underline font-bold text-[#d9534f]">
              My Page
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="no-underline cursor-pointer font-thin text-gray-500"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth/signin" className="no-underline text-[#d9534f]">
            Login / Register
          </Link>
        )}
      </nav>
    </header>
  );
}
