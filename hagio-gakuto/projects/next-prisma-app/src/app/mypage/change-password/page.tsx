"use client";

import { Form } from "@/components/form/Form";
import { PasswordInput } from "@/components/inputs/PasswordInput";
import { useTitle } from "@/hooks/useTitle";
import { useActionState, useEffect } from "react";
import { changePasswordAction } from "./actions/changePasswordActions";
import { useLoading } from "@/context/LoadingContext";
import { showErrorToast, showSuccessToast } from "@/utils/ToastUtils";
import { useRouter } from "next/navigation";

const ChangePassword: React.FC = () => {
  useTitle("パスワード変更");
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const [state, formAction] = useActionState(changePasswordAction, {
    message: null,
    errors: {},
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      setIsLoading(false); // ローディング状態を解除
      showSuccessToast(state.message || "パスワードが変更されました"); // Toastを表示

      router.push("/");
    } else if (state.message) {
      showErrorToast(state.message);
    }
  }, [state, router]);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
      <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
        {/* <ServerErrorMsg msg={nonFieldError} /> */}
        <Form
          action={formAction}
          buttonText="パスワード変更"
          formTitle="Change Password"
        >
          <PasswordInput
            name="currentPassword"
            label="Current Password"
            placeholder="現在のパスワードを入力"
            errorMsg={state.errors?.currentPassword}
            defaultValue={state.fields?.currentPassword || ""} // 初期値を設定
            rules={[(v) => (!v ? "現在のパスワードは必須です" : undefined)]}
          />

          <PasswordInput
            name="newPassword"
            label="New Password"
            placeholder="新しいパスワードを入力"
            errorMsg={state.errors?.newPassword}
            defaultValue={state.fields?.newPassword || ""} // 初期値を設定
            rules={[(v) => (!v ? "新しいパスワードは必須です" : undefined)]}
          />
          <PasswordInput
            name="confirmPassword"
            label="Confirm Password"
            placeholder="新しいパスワードを再入力"
            errorMsg={state.errors?.confirmPassword}
            defaultValue={state.fields?.confirmPassword || ""} // 初期値を設定
            rules={[
              (v) => (!v ? "新しいパスワードの確認は必須です" : undefined),
            ]}
          />
        </Form>
      </div>
    </div>
  );
};
export default ChangePassword;
