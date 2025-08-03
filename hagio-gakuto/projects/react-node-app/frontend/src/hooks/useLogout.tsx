import { useState } from "react";
import { useLoading } from "../components/context/LoadingContext";
import { useNavigate } from "react-router-dom";
import { useApiErrorHandler } from "./useApiErrorHandler";
import { ValidationError } from "../types/ValidationErrorType";
import { showSuccessToast } from "../utils/toastUtils";
import { postLogout } from "../api/postLogout";
import { useAuth } from "../components/context/AuthContext";

export const useLogout = () => {
  const [validationError, setValidationError] = useState<
    ValidationError | undefined
  >(undefined);
  const { setUser } = useAuth();

  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { handleApiError, nonFieldError, clearNonFieldError } =
    useApiErrorHandler(setValidationError);

  const executeLogout = async () => {
    setLoading(true);
    setValidationError(undefined);
    clearNonFieldError();

    try {
      const res = await postLogout();
      setUser(null);
      showSuccessToast("ログアウトしました");
      navigate("/");
      return res.data;
    } catch (e: any) {
      handleApiError(e as any);
    } finally {
      setLoading(false);
    }
  };
  return { executeLogout, validationError, nonFieldError };
};
