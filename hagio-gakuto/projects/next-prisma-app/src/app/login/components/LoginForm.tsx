"use client";
import React, { useActionState, useEffect } from "react";
import { PasswordInput } from "../../../components/inputs/PasswordInput";
import { EmailInput } from "../../../components/inputs/EmailInput";
import Link from "next/link";
import { useTitle } from "@/hooks/useTitle";
import { useRouter } from "next/navigation";
import { Form } from "@/components/form/Form";
import { loginAction } from "../actions/loginActions";
import { showErrorToast, showSuccessToast } from "@/utils/ToastUtils";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";

type Inputs = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  useTitle("ログイン");
  const { setIsLoading } = useLoading();
  const { fetchUser } = useAuth();
  const [state, formAction] = useActionState(loginAction, {
    message: null,
    errors: {},
    success: false,
  });
  const router = useRouter();

  // ★ useEffectを追加してstateの変更を監視
  useEffect(() => {
    if (state.success) {
      setIsLoading(false); // ローディング状態を解除
      showSuccessToast(state.message || "ログインしました"); // Toastを表示
      fetchUser().then(() => {
        // ★ 再取得が完了してからページを遷移
        router.push("/");
      });
    } else if (state.message) {
      showErrorToast(state.message);
    }
  }, [state, router]);

  return (
    <div className="relative bg-white rounded shadow-2xl p-7 sm:p-10">
      <h3 className="mb-4 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl">
        Welcome Back!
      </h3>
      {/* <ServerErrorMsg msg={nonFieldError} /> */}

      <Form action={formAction} buttonText="Login">
        <EmailInput
          name="email"
          label="E-mail"
          placeholder="sample@leverages.jp"
          errorMsg={state.errors?.email}
          defaultValue={state.fields?.email || ""}
          rules={[
            (v) => (!v ? "メールアドレスは必須です" : undefined),
            (v) => (v.length < 2 ? "2文字以上入力してください" : undefined),
            (v) => (v.length > 50 ? "50文字以下で入力してください" : undefined),
            (v) =>
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)
                ? undefined
                : "有効なメールアドレスを入力してください",
            (v) =>
              /^[^\s]+$/.test(v) ? undefined : "先頭にスペースは使用できません",
            (v) =>
              /^[^\s]+$/.test(v) ? undefined : "末尾にスペースは使用できません",
            (v) =>
              /^[^\s]+$/.test(v)
                ? undefined
                : "連続するスペースは使用できません",
          ]}
        />

        <PasswordInput
          name="password"
          label="Password"
          placeholder="パスワードを入力"
          errorMsg={state.errors?.password}
          defaultValue={state.fields?.password || ""} // 初期値を設定
          rules={[(v) => (!v ? "パスワードは必須です" : undefined)]}
        />
        <div className="text-right">
          <Link
            href="#"
            className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Forgot password?
          </Link>
        </div>

        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Don’t have an account yet?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Sign up
          </Link>
        </p>
      </Form>
    </div>
  );
};
export default LoginForm;
