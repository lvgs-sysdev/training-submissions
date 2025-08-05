import { useState } from "react";
// import { useLoading } from "../components/context/LoadingContext";
// import { useNavigate } from "react-router-dom";
// import { useApiErrorHandler } from "./useApiErrorHandler";
// import { ValidationError } from "../types/ValidationErrorType";
// import { postLogin } from "../api/postLogin";
// import { showSuccessToast } from "../utils/toastUtils";
// import { useAuth } from "../components/context/AuthContext";
// import { getMe } from "../api/getAuth";

export const useLogin = () => {
  //   const [validationError, setValidationError] = useState<
  //     ValidationError | undefined
  //   >(undefined);
  //   const { setLoading } = useLoading();
  //   const navigate = useNavigate();
  //   const { handleApiError, nonFieldError, clearNonFieldError } =
  //     useApiErrorHandler(setValidationError);
  //   const { setUser } = useAuth();
  //   const executeLogin = async (data: { email: string; password: string }) => {
  //     setLoading(true);
  //     setValidationError(undefined);
  //     clearNonFieldError();
  //     try {
  //       const res = await postLogin(data);
  //       const authRes = await getMe();
  //       setUser(authRes.data);
  //       showSuccessToast("ログインしました");
  //       navigate("/");
  //       return res.data;
  //     } catch (e: any) {
  //       handleApiError(e as any);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   return { executeLogin, validationError, nonFieldError };
};
