import { useFormContext } from "react-hook-form";
import { ErrorMsg } from "../error/ErrorMsg";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEffect, useState } from "react";
import { ValidationError } from "../../types/ValidationErrorType";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  errorMsg?: ValidationError;
  rules?: any;
};
export const PasswordInput = ({
  name,
  label,
  placeholder,
  errorMsg,
  rules,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
    setError,
  } = useFormContext();

  useEffect(() => {
    if (errorMsg && errorMsg.field == name) {
      setError(name, {
        type: "manual", // 手動で設定するエラーであることを示す
        message: errorMsg.message,
      });
    }
  }, [errorMsg]);

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="mb-1 sm:mb-2">
      {label && (
        <label className="inline-block mb-1 font-medium">{label}</label>
      )}
      <div className="relative mb-2">
        <input
          type={showPassword ? "text" : "password"}
          className="flex-grow w-full h-12 px-4 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
          {...register(name, rules)}
          placeholder={placeholder}
        />
        {/* トグルボタン */}
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/4 cursor hover"
        >
          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </button>
      </div>
      {errors[name] && <ErrorMsg msg={errors[name]?.message?.toString()} />}
    </div>
  );
};
