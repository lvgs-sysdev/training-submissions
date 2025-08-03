import { useFormContext } from "react-hook-form";
import { ErrorMsg } from "../error/ErrorMsg";
import { useEffect } from "react";
import { ValidationError } from "../../types/ValidationErrorType";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  errorMsg?: ValidationError;
  rules?: any;
};
export const EmailInput = ({
  name,
  label,
  placeholder,
  errorMsg,
  rules,
}: Props) => {
  const {
    register,
    formState: { errors },
    setError,
  } = useFormContext();

  // console.log(errors);

    useEffect(() => {
      if (errorMsg && errorMsg.field == name) {
        setError(name, {
          type: "manual", // 手動で設定するエラーであることを示す
          message: errorMsg.message,
        });
      }
    }, [errorMsg]);

  return (
    <div className="mb-1 sm:mb-2">
      {label && (
        <label className="inline-block mb-1 font-medium">{label}</label>
      )}
      <div className="relative mb-2">
        <input
          type="email"
          className="flex-grow w-full h-12 px-4 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
          {...register(name, rules)}
          placeholder={placeholder}
        />
      </div>
      {errors[name] && <ErrorMsg msg={errors[name]?.message?.toString()} />}
    </div>
  );
};
