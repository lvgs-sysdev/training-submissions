"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/top";

  return (
    <div className="pt-20 px-10 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-6 text-[#d9534f]">WELCOME!</h1>
      <p className="mt-5 mb-8 text-gray-600">
        投稿機能を利用するにはログインが必要です
      </p>

      <div className="flex justify-center">
        <GoogleLoginButton callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
