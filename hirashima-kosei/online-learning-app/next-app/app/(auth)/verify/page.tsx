"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import useRefreshToken from "@/features/auth/hooks/useRefreshToken";
import { useSearchParams } from "next/navigation";

export default function Verify() {
  const searchParams = useSearchParams();
  const verifiedEmail = searchParams.get("email");

  const { error, setSubmissionMsg, refreshToken } = useRefreshToken();

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center gap-8 text-center">
        <img
          src="img/iconmonstr-paper-plane-7.svg"
          className="w-[10rem] h-auto"
        />
        {!error ? (
          <>
            <h1 className="text-4xl">{String(setSubmissionMsg)}</h1>
            <p>
              {verifiedEmail}
              宛に認証メールを送信しました。メールに記載されたリンクから登録を完了してください。
            </p>
            <Button onClick={async () => await refreshToken(verifiedEmail!)}>
              メールを再送信する
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 bg-red-50 border border-red-200 rounded-lg m-10">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                メール送信処理が失敗しました。
              </h1>
              <p className="text-gray-600 text-center mb-4">
                時間をおいて再度お試しください。
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
