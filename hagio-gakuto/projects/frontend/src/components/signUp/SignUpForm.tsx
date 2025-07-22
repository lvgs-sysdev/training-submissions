import React, { useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { PasswordInput } from "../forms/PasswordInput";
import { EmailInput } from "../forms/EmailInput";
import { useSignUp } from "../../hooks/useSignUp";
import { ErrorMsg } from "../error/ErrorMsg";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { passwordValidation } from "../../utils/Regex";
import { ServerErrorMsg } from "../error/ServerErrorMsg";

type Inputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpForm: React.FC = () => {
  const methods = useForm<Inputs>();
  const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState<
    string | null
  >(null);
  const { handleSubmit } = methods;
  const { executeSignup, validationError, nonFieldError } = useSignUp();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await setConfirmPasswordErrorMsg(null);
    const isMatch = await matchConfirmPassword(data);
    if (!isMatch) {
      alertConfirmPassword();
      return;
    }
    await executeSignup(data);
  };

  const matchConfirmPassword = (data: Inputs) => {
    return data.password === data.confirmPassword;
  };

  const alertConfirmPassword = () => {
    setConfirmPasswordErrorMsg(ERROR_MESSAGES.PASSWORD_MISMATCH);
  };

  return (
    <>
      <FormProvider {...methods}>
        <div className="relative bg-white rounded shadow-2xl p-7 sm:p-10">
          <h3 className="mb-4 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl">
            Create an Account
          </h3>
          <ServerErrorMsg msg={nonFieldError} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <EmailInput
              name="email"
              label="E-mail"
              placeholder="sample@leverages.jp"
              errorMsg={validationError}
              rules={{
                required: ERROR_MESSAGES.INPUT_REQUIRED,
              }}
            />
            <PasswordInput
              name="password"
              label="Password"
              placeholder="パスワードを入力"
              errorMsg={validationError}
              rules={{
                required: ERROR_MESSAGES.INPUT_REQUIRED,
                validate: passwordValidation,
              }}
            />
            <PasswordInput
              name="confirmPassword"
              label="ConfirmPassword"
              placeholder="同じパスワードを入力"
              errorMsg={validationError || undefined}
              rules={{
                required: ERROR_MESSAGES.INPUT_REQUIRED,
                validate: passwordValidation,
              }}
            />
            {confirmPasswordErrorMsg && (
              <ErrorMsg msg={confirmPasswordErrorMsg} />
            )}
            <div className="mt-4 mb-2 sm:mb-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </FormProvider>
    </>
  );
};
export default SignUpForm;
