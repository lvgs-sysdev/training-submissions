import Link from 'next/link';
import { Session } from 'next-auth';
import { Suspense } from 'react';
import { HeaderNav } from './HeaderNav';

type HeaderProps = {
  session: Session | null;
};

export default function Header({ session }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 h-16 min-h-16 flex items-center justify-between px-8 border-b border-gray-200 bg-white bg-opacity-95 backdrop-blur">
      <Link href="/" className="no-underline text-[20px] font-bold text-[#d9534f]">
        Tabelog Clone
      </Link>

      <nav className="flex items-center gap-5 h-full">
        <Suspense fallback={<div className="w-20" />}>
          <HeaderNav session={session} />
        </Suspense>
      </nav>
    </header>
  );
}
