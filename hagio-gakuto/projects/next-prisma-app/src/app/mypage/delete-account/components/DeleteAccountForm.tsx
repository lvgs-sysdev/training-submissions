"use client";

import { Form } from "@/components/form/Form";
import { useAuth } from "@/context/AuthContext";
import { useActionState, useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";
import { showErrorToast, showSuccessToast } from "@/utils/ToastUtils";
import { useRouter } from "next/navigation";
import { deleteAccountAction } from "../actions/deleteAccountAction";
import { PasswordInput } from "@/components/inputs/PasswordInput";

export default function DeleteAccountForm() {
  const { fetchUser, logout } = useAuth();
  const { setIsLoading } = useLoading();
  const [state, formAction] = useActionState(deleteAccountAction, {
    message: null,
    errors: {},
    success: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setIsLoading(false); // ローディング状態を解除
      showSuccessToast(state.message || "アカウントが削除されました"); // Toastを表示
      logout()
        .then(fetchUser)
        .then(() => {
          router.push("/login");
        }); // ユーザー情報を再取得
    } else if (state.message) {
      showErrorToast(state.message);
    }
  }, [state]);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
      <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
        <Form
          action={formAction}
          buttonText="アカウントを削除"
          formTitle="アカウント削除"
          confirmationMessage="本当にアカウントを削除しますか？この操作は元に戻せません。"
        >
          <PasswordInput
            name="password"
            label="Password"
            placeholder="パスワードを入力"
            errorMsg={state.errors?.password}
            defaultValue={state.fields?.password || ""} // 初期値を設定
            rules={[(v) => (!v ? "パスワードは必須です" : undefined)]}
          />
          <PasswordInput
            name="confirmPassword"
            label="Confirm Password"
            placeholder="パスワードを再入力"
            errorMsg={state.errors?.confirmPassword}
            defaultValue={state.fields?.confirmPassword || ""} // 初期値を設定
            rules={[(v) => (!v ? "パスワードの確認は必須です" : undefined)]}
          />
        </Form>
      </div>
    </div>
  );
}
