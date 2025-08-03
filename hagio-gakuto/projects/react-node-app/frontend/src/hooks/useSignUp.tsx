import { useState } from "react";
import { postSignup } from "../api/postSignUp";
import { useLoading } from "../components/context/LoadingContext";
import { useNavigate } from "react-router-dom";
import { useApiErrorHandler } from "./useApiErrorHandler";
import { ValidationError } from "../types/ValidationErrorType";
import { showSuccessToast } from "../utils/toastUtils";

export const useSignUp = () => {
  const [validationError, setValidationError] = useState<
    ValidationError | undefined
  >(undefined);

  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { handleApiError, nonFieldError, clearNonFieldError } =
    useApiErrorHandler(setValidationError);

  const executeSignup = async (data: { email: string; password: string }) => {
    setLoading(true);
    setValidationError(undefined);
    clearNonFieldError();

    try {
      const res = await postSignup(data);
      showSuccessToast("登録完了しました");
      navigate("/login");
      return res.data;
    } catch (e: any) {
      handleApiError(e as any);
    } finally {
      setLoading(false);
    }
  };
  return { executeSignup, validationError, nonFieldError };
};
