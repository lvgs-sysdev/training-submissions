'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Session } from 'next-auth';

export function HeaderNav({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentUrl = searchParams.size > 0
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  const loginUrl = `/auth/signin?callbackUrl=${encodeURIComponent(currentUrl)}`;
  const isAuthenticated = !!session;

  if (pathname === '/auth/signin') {
    return null;
  }

  if (isAuthenticated) {
    return (
      <>
        <Link
          href="/mypage"
          className="no-underline font-bold text-[#d9534f]"
        >
          My Page
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="no-underline cursor-pointer font-thin text-gray-500 hover:text-gray-700"
        >
          Logout
        </button>
      </>
    );
  }

  return (
    <Link
      href={loginUrl}
      className="no-underline text-[#d9534f]"
    >
      Login / Register
    </Link>
  );
}
