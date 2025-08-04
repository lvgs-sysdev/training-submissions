"use client";

import { useFormState, useFormStatus } from "react-dom";

// フォームの状態を表す共通の型
interface FormState {
  message: string | null;
}

// フォームに渡すpropsの型
interface FormProps {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  children: React.ReactNode;
  buttonText: string;
}

// 送信ボタンコンポーネント
function SubmitButton({ text }: { readonly text: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full ...">
      {pending ? "送信中..." : text}
    </button>
  );
}

// 共通フォームコンポーネント
export function Form({ action, children, buttonText }: Readonly<FormProps>) {
  const initialState = { message: null };
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction}>
      {/* ここに各フォーム固有の入力欄が入る */}
      {children}

      {/* サーバーアクションから返されたエラーメッセージを表示 */}
      {state.message && <p style={{ color: "red" }}>{state.message}</p>}

      <div className="mt-4 mb-2 sm:mb-4">
        <SubmitButton text={buttonText} />
      </div>
    </form>
  );
}
