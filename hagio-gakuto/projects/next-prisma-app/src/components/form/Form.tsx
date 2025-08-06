"use client";

import { useFormStatus } from "react-dom";

// フォームに渡すpropsの型
interface FormProps {
  action: (payload: FormData) => void;
  children: React.ReactNode;
  buttonText: string;
  formTitle: string; // オプションでフォームのタイトルを受け取る
  confirm?: boolean; // 確認メッセージを表示するかどうか
  confirmationMessage?: string; // 確認メッセージをオプションで受け取る
}

// 送信ボタンコンポーネント
function SubmitButton({ text }: { readonly text: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="mt-4 mb-2 sm:mb-4">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center cursor-pointer justify-center w-full h-12 px-6 font-medium tracking-wide transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
        style={{ opacity: pending ? 0.5 : 1 }}
      >
        {pending ? "送信中..." : text}
      </button>
    </div>
  );
}

// 共通フォームコンポーネント
export function Form({
  action,
  children,
  buttonText,
  formTitle,
  confirmationMessage,
}: Readonly<FormProps>) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // もし確認メッセージが設定されていて、ユーザーが「キャンセル」を押したら
    if (confirmationMessage && !window.confirm(confirmationMessage)) {
      // フォームの送信を中止する
      event.preventDefault();
    }
  };
  return (
    <form action={action} onSubmit={handleSubmit}>
      <h3 className="mb-4 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl">
        {formTitle}
      </h3>
      {children}
      <div className="mt-4 mb-2 sm:mb-4">
        <SubmitButton text={buttonText} />
      </div>
    </form>
  );
}
