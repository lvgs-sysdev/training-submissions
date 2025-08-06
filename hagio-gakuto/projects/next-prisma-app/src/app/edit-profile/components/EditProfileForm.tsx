"use client";

import { Form } from "@/components/form/Form";
import { AvatarInput } from "@/components/inputs/ImageInput";
import { EmailInput } from "@/components/inputs/EmailInput";
import { TextInput } from "@/components/inputs/TextInput";
import { useAuth } from "@/context/AuthContext";
import { useTitle } from "@/hooks/useTitle";
import { editProfileAction } from "../actions/editProfileAction";
import { useActionState, useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";
import { showErrorToast, showSuccessToast } from "@/utils/ToastUtils";
import { useRouter } from "next/navigation";

export default function EditProfileForm() {
  useTitle("プロフィール変更");
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
    <div className="bg-gray-50 min-h-screen pt-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl p-8">
        <Form action={formAction} buttonText="プロフィールを更新">
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
              defaultValue={user?.name}
            />
            <EmailInput
              name="email"
              label="メールアドレス"
              defaultValue={user?.email}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
