import { useState } from "react";
import { signup } from "../api/signUp/postSignUp";
import { useLoading } from "../components/context/LoadingContext";
import { useNavigate } from "react-router-dom";
import { useApiErrorHandler } from "./useApiErrorHandler";
import { ValidationError } from "../types/ValidationErrorType";

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
      const res = await signup(data);
      alert("登録完了！ログインしてください");
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
