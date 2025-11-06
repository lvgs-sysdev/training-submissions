"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useRegisterForm from "../hooks/useRegisterForm";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RegisterForm() {
  const {
    isPasswordDisplayed,
    setIsPasswordDisplayed,
    setEmail,
    setUserName,
    setPassword,
    submitPayload,
    isWaitingForRegister,
    error,
  } = useRegisterForm();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitPayload();
  }

  return (
    <>
      <form onSubmit={(event) => handleSubmit(event)}>
        {!!error && (
          <>
            <Alert variant="destructive" className="mb-5">
              <AlertCircleIcon />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>
                <p>{error}</p>
              </AlertDescription>
            </Alert>
          </>
        )}
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="user_name">ユーザー名</Label>
            <Input
              id="user_name"
              type="text"
              required
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">パスワード</Label>
            {isPasswordDisplayed ? (
              <Input
                id="password"
                type="text"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            ) : (
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex flex-start items-center gap-2">
              <Checkbox
                onClick={() => setIsPasswordDisplayed(!isPasswordDisplayed)}
              />
              {isPasswordDisplayed ? (
                <p className="text-muted-foreground">
                  パスワードを非表示にする
                </p>
              ) : (
                <p className="text-muted-foreground">パスワードを表示する</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full">
            {isWaitingForRegister ? <Spinner /> : "登録する"}
          </Button>
        </div>
      </form>
    </>
  );
}
