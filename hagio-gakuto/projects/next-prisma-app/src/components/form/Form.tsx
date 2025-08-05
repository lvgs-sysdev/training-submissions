"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { ServerErrorMsg } from "../errors/ServerErrorMsg";

// フォームの状態を表す共通の型
interface FormState {
  message: string | null;
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  success: boolean;
}

// フォームに渡すpropsの型
interface FormProps {
  action: (payload: FormData) => void;
  children: React.ReactNode;
  buttonText: string;
}

// 送信ボタンコンポーネント
function SubmitButton({ text }: { readonly text: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="mt-4 mb-2 sm:mb-4">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
        style={{ opacity: pending ? 0.5 : 1 }}
      >
        {pending ? "送信中..." : text}
      </button>
    </div>
  );
}

// 共通フォームコンポーネント
export function Form({ action, children, buttonText }: Readonly<FormProps>) {
  return (
    <form action={action}>
      {children}
      <div className="mt-4 mb-2 sm:mb-4">
        <SubmitButton text={buttonText} />
      </div>
    </form>
  );
}
