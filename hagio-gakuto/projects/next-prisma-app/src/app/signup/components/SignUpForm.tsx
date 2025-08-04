"use client";

import { Form } from "@/components/form/Form";
import { EmailInput } from "@/components/inputs/EmailInput"; // Email用に汎用Inputを使用
import { PasswordInput } from "@/components/inputs/PasswordInput"; // Password用に専用コンポーネントを使用
import { signUpAction } from "../actions/signUpActions";

export default function SignUpForm() {
  return (
    <div className="relative bg-white ...">
      <h3 className="...">Create an Account</h3>

      <Form action={signUpAction} buttonText="Sign Up">
        <EmailInput
          name="email"
          label="E-mail"
          placeholder="sample@leverages.jp"
        />
        <PasswordInput
          name="password"
          label="Password"
          placeholder="パスワードを入力"
          required
        />
        <PasswordInput
          name="confirmPassword"
          label="Confirm Password"
          placeholder="同じパスワードを入力"
          required
        />
      </Form>
    </div>
  );
}
