import { useState } from "react";
import { useLoading } from "../components/context/LoadingContext";
import { useNavigate } from "react-router-dom";
import { useApiErrorHandler } from "./useApiErrorHandler";
import { ValidationError } from "../types/ValidationErrorType";
import { login } from "../api/postLogin";
import { showSuccessToast } from "../utils/toastUtils";
import { useAuth } from "../components/context/AuthContext";
import { me } from "../api/getAuth";

export const useLogin = () => {
  const [validationError, setValidationError] = useState<
    ValidationError | undefined
  >(undefined);

  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { handleApiError, nonFieldError, clearNonFieldError } =
    useApiErrorHandler(setValidationError);
  const { setUser } = useAuth();

  const executeLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    setValidationError(undefined);
    clearNonFieldError();

    try {
      const res = await login(data);
      const authRes = await me();
      setUser(authRes.data);
      showSuccessToast("ログインしました");
      navigate("/");
      return res.data;
    } catch (e: any) {
      handleApiError(e as any);
    } finally {
      setLoading(false);
    }
  };
  return { executeLogin, validationError, nonFieldError };
};
