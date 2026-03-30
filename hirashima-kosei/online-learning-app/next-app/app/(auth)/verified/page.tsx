"use client";

import useVerification from "@/features/auth/hooks/useVerification";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Verified() {
  const searchParams = useSearchParams();
  const verifiedToken = searchParams.get("verifiedToken");

  const { successVerification, verifyToken } = useVerification(verifiedToken!);

  useEffect(() => {
    const runVerification = async () => {
      await verifyToken();
    };
    runVerification();
  }, []);

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center gap-8 text-center">
        {successVerification ? (
          <>
            <img
              src="img/iconmonstr-check-mark-7.svg"
              className="w-[10rem] h-auto"
            />
            <p className="text-2xl">
              メールアドレス認証に成功しました。
              <a href="/login" className="underline">
                ログイン
              </a>
              してください。
            </p>
          </>
        ) : (
          <>
            <img
              src="img/iconmonstr-error-7.svg"
              className="w-[10rem] h-auto"
            />
            <p className="text-2xl">
              メールアドレス認証に失敗しました。
              <a href="/register" className="underline">
                ユーザー登録
              </a>
              からやり直してください。
            </p>
          </>
        )}
      </div>
    </>
  );
}
