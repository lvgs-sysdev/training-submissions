import React, { useState } from "react";
import { useTitle } from "../hooks/useTitle";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { ServerErrorMsg } from "../components/error/ServerErrorMsg";
import { PasswordInput } from "../components/forms/PasswordInput";
import { ErrorMsg } from "../components/error/ErrorMsg";
import { passwordValidation } from "../utils/Regex";
import { useChangePassword } from "../hooks/useChangePassword";

type Inputs = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePassword: React.FC = () => {
  useTitle("パスワード変更");
  const methods = useForm<Inputs>();
  const { handleSubmit } = methods;
  const { changePassword, validationError, nonFieldError } =
    useChangePassword();
  const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState<
    string | null
  >(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await setConfirmPasswordErrorMsg(null);
    const isMatch = await matchConfirmPassword(data);

    if (!isMatch) {
      alertConfirmPassword(ERROR_MESSAGES.PASSWORD_MISMATCH);
      return;
    }

    const isChanged = await isNewPasswordChanged(data);
    if (!isChanged) {
      alertConfirmPassword(ERROR_MESSAGES.PASSWORD_NOT_CHANGED);
      return;
    }
    await changePassword(data);
  };

  const matchConfirmPassword = (data: Inputs) => {
    return data.newPassword === data.confirmPassword;
  };

  const isNewPasswordChanged = (data: Inputs) => {
    return data.password !== data.newPassword;
  };

  const alertConfirmPassword = (message: string) => {
    setConfirmPasswordErrorMsg(message);
  };

  return (
    <>
      <section>
        <FormProvider {...methods}>
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
            <a
              href="#"
              className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            >
              <img
                className="w-8 h-8 mr-2"
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                alt="logo"
              />
              Flowbite
            </a>
            <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
              <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Change Password
              </h2>
              <ServerErrorMsg msg={nonFieldError} />
              <form
                className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <PasswordInput
                  name="password"
                  label="Password"
                  placeholder="現在のパスワードを入力"
                  errorMsg={validationError || undefined}
                  rules={{
                    required: ERROR_MESSAGES.INPUT_REQUIRED,
                  }}
                />
                <PasswordInput
                  name="newPassword"
                  label="New Password"
                  placeholder="新しいパスワードを入力"
                  errorMsg={validationError}
                  rules={{
                    required: ERROR_MESSAGES.INPUT_REQUIRED,
                    validate: passwordValidation,
                  }}
                />
                <PasswordInput
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="同じパスワードを入力"
                  errorMsg={validationError || undefined}
                  rules={{
                    required: ERROR_MESSAGES.INPUT_REQUIRED,
                  }}
                />
                {confirmPasswordErrorMsg && (
                  <ErrorMsg msg={confirmPasswordErrorMsg} />
                )}
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Change passwod
                </button>
              </form>
            </div>
          </div>
        </FormProvider>
      </section>
    </>
  );
};
export default ChangePassword;
