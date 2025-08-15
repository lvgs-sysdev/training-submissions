"use client";

import { Form } from "@/components/form/Form";
import { AvatarInput } from "@/components/inputs/ImageInput";
import { EmailInput } from "@/components/inputs/EmailInput";
import { TextInput } from "@/components/inputs/TextInput";
import { useAuth } from "@/context/AuthContext";
import { editProfileAction } from "../actions/editProfileAction";
import { useActionState, useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";
import { showErrorToast, showSuccessToast } from "@/utils/ToastUtils";
import { useRouter } from "next/navigation";

export default function EditProfileForm() {
  const { user, fetchUser } = useAuth();
  const { setIsLoading } = useLoading();
  const [state, formAction] = useActionState(editProfileAction, {
    message: null,
    errors: {},
    success: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setIsLoading(false); // ローディング状態を解除
      showSuccessToast(state.message || "プロフィールが更新されました"); // Toastを表示
      fetchUser().then(() => {
        router.push("/mypage");
      }); // ユーザー情報を再取得
    } else if (state.message) {
      showErrorToast(state.message);
    }
  }, [state]);

  return (
    // <div className="bg-gray-50 min-h-screen pt-12">
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl p-8">
      <Form
        action={formAction}
        buttonText="プロフィールを更新"
        formTitle="プロフィール編集"
      >
        <AvatarInput
          name="avatar"
          defaultImage={
            user?.avatar_url || "/images/avatars/default-avatar.png"
          }
        />
        <div className="space-y-4">
          <TextInput
            name="name"
            label="ユーザー名"
            defaultValue={state.fields?.name || user?.name || ""}
            rules={[
              (v) => (!v ? "名前は必須です" : undefined),
              (v) => (v.length < 2 ? "2文字以上入力してください" : undefined),
              (v) =>
                v.length > 50 ? "50文字以下で入力してください" : undefined,
            ]}
            errorMsg={state.errors?.name}
          />
          <EmailInput
            name="email"
            label="メールアドレス"
            defaultValue={state.fields?.email || user?.email || ""}
            errorMsg={state.errors?.email}
            rules={[
              (v) => (!v ? "メールアドレスは必須です" : undefined),
              (v) => (v.length < 2 ? "2文字以上入力してください" : undefined),
              (v) =>
                v.length > 50 ? "50文字以下で入力してください" : undefined,
              (v) =>
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)
                  ? undefined
                  : "有効なメールアドレスを入力してください",
              (v) =>
                /^[^\s]+$/.test(v)
                  ? undefined
                  : "先頭にスペースは使用できません",
              (v) =>
                /^[^\s]+$/.test(v)
                  ? undefined
                  : "末尾にスペースは使用できません",
              (v) =>
                /^[^\s]+$/.test(v)
                  ? undefined
                  : "連続するスペースは使用できません",
            ]}
          />
        </div>
      </Form>
    </div>
    // </div>
  );
}
