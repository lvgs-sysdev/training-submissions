"use client";

import { Form } from "@/components/form/Form";
import { EmailInput } from "@/components/inputs/EmailInput"; // Email用に汎用Inputを使用
import { PasswordInput } from "@/components/inputs/PasswordInput"; // Password用に専用コンポーネントを使用
import { signUpAction } from "../actions/signUpActions";
import { TextInput } from "@/components/inputs/ TextInput";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { showErrorToast, showSuccessToast } from "@/utils/ToastUtils";
import { useTitle } from "@/hooks/useTitle";

export default function SignUpForm() {
  useTitle("ユーザー登録");
  const [state, formAction] = useActionState(signUpAction, {
    message: null,
    errors: {},
    success: false,
  });
  const router = useRouter();

  // ★ useEffectを追加してstateの変更を監視
  useEffect(() => {
    if (state.success) {
      showSuccessToast(state.message || "登録完了しました"); // Toastを表示
      router.push("/login"); // ページ遷移
    } else if (state.message) {
      showErrorToast(state.message);
    }
  }, [state, router]);

  return (
    <div className="relative bg-white rounded shadow-2xl p-7 sm:p-10">
      <h3 className="mb-4 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl">
        Create an Account
      </h3>

      <Form action={formAction} buttonText="Sign Up">
        <TextInput
          name="name"
          label="Name"
          placeholder="山田 太郎"
          errorMsg={state.errors?.name}
          defaultValue={state.fields?.name || ""}
          rules={[
            (v) => (!v ? "名前は必須です" : undefined),
            (v) => (v.length < 2 ? "2文字以上入力してください" : undefined),
            (v) => (v.length > 50 ? "50文字以下で入力してください" : undefined),
            (v) =>
              /^[a-zA-Z0-9\s]+$/.test(v)
                ? undefined
                : "英数字とスペースのみ使用可能です",
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
          rules={[
            (v) => (!v ? "パスワードは必須です" : undefined),
            (v) => (v.length < 8 ? "8文字以上入力してください" : undefined),
            (v) =>
              v.length > 100 ? "100文字以下で入力してください" : undefined,
            (v) =>
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v)
                ? undefined
                : "大文字、小文字、数字を含む8文字以上のパスワードを入力してください",
          ]}
        />
        <PasswordInput
          name="confirmPassword"
          label="Confirm Password"
          placeholder="同じパスワードを入力"
          errorMsg={state.errors?.confirmPassword}
          defaultValue={state.fields?.confirmPassword || ""} // 初期値を設定
          rules={[
            (v) => (!v ? "確認用パスワードは必須です" : undefined),
            (v) => (v.length < 8 ? "8文字以上入力してください" : undefined),
            (v) =>
              v.length > 100 ? "100文字以下で入力してください" : undefined,
            (v) =>
              v === state.fields?.password
                ? undefined
                : "パスワードが一致しません",
          ]}
        />
      </Form>
    </div>
  );
}
