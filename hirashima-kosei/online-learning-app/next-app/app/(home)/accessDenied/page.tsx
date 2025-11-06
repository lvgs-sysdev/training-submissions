"use client";

import Link from "next/link";

export default function AccessDenied() {
  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center gap-8 text-center">
        <h1 className="text-4xl">Access Denied</h1>
        <p className="text-2xl">自分以外のページは閲覧できません。</p>
        <Link href="/" className="underline">
          戻る
        </Link>
      </div>
    </>
  );
}
