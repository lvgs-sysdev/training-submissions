import { useState } from "react";
import { useLoading } from "../components/context/LoadingContext";
import { useNavigate } from "react-router-dom";
import { useApiErrorHandler } from "./useApiErrorHandler";
import { ValidationError } from "../types/ValidationErrorType";
import { showSuccessToast } from "../utils/toastUtils";
import { putChangePassword } from "../api/putChangePassword";

export const useChangePassword = () => {
  const [validationError, setValidationError] = useState<
    ValidationError | undefined
  >(undefined);

  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { handleApiError, nonFieldError, clearNonFieldError } =
    useApiErrorHandler(setValidationError);

  const changePassword = async (data: {
    password: string;
    newPassword: string;
  }) => {
    setLoading(true);
    setValidationError(undefined);
    clearNonFieldError();

    try {
      const res = await putChangePassword(data);
      console.log(data);
      showSuccessToast("変更完了しました");
      navigate("/mypage");
      return res.data;
    } catch (e: any) {
      handleApiError(e as any);
    } finally {
      setLoading(false);
    }
  };
  return { changePassword, validationError, nonFieldError };
};
