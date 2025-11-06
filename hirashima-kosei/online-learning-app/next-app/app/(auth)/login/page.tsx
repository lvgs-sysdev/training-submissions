"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/features/auth/components/LoginForm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";
import { useEffect } from "react";
import { nextAxiosClient } from "@/lib/api/api-client";

interface ApiError {
  code?: string;
  message: string;
}

export default function Login() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const { logout } = useAuth();

  useEffect(() => {
    if (!!message) {
      const executeLogout = async () => {
        try {
          await nextAxiosClient.post("/nextAuth/logout");
        } catch (err) {
          const apiError = err as ApiError;
          if (apiError.code === "P2025") console.log(err);
        }
      };

      executeLogout();
      logout();
      toast(message, {
        description: "",
        action: {
          label: "閉じる",
          onClick: () => console.log("Undo"),
        },
      });
    }
  }, []);

  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-lg text-center mb-2">ログイン</CardTitle>
            <CardDescription>
              メールアドレスとパスワードを入力してログインしてください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            アカウントがありませんか？
            <Link href="/register" className="underline hover:font-bold">
              登録する
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
