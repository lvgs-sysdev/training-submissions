import React from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { PasswordInput } from "../forms/PasswordInput";
import { EmailInput } from "../forms/EmailInput";
import { Link } from "react-router-dom";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

type Inputs = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const methods = useForm<Inputs>();
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <>
      <FormProvider {...methods}>
        <div className="relative bg-white rounded shadow-2xl p-7 sm:p-10">
          <h3 className="mb-4 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl">
            Welcom Back!
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <EmailInput
              name="email"
              label="E-mail"
              placeholder="sample@leverages.jp"
            />
            <PasswordInput
              name="password"
              label="Password"
              placeholder="パスワードを入力"
              rules={{
                required: ERROR_MESSAGES.INPUT_REQUIRED,
              }}
            />
            <div className="mt-4 mb-2 sm:mb-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
              >
                Login
              </button>
            </div>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </FormProvider>
    </>
  );
};
export default LoginForm;
