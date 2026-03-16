import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterForm from "@/features/auth/components/RegisterForm";
import Link from "next/link";

export default function Register() {
  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-lg text-center mb-2">
              ユーザー登録
            </CardTitle>
            <CardDescription>
              入力項目を入力して登録してください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            アカウントをすでに持っていますか？
            <Link href="/login" className="underline hover:font-bold">
              ログイン
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
