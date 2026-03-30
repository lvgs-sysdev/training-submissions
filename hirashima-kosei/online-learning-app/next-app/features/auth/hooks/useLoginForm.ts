import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { nextAxiosClient } from "@/lib/api/api-client";

export default function useLoginForm() {
  const { login } = useAuth();

  const router = useRouter();

  const [isPasswordDisplayed, setIsPasswordDisplayed] =
    useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isWaitingForLogin, setIsWaitingForLogin] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const submitPayload = async () => {
    try {
      setIsWaitingForLogin(true);
      const response = await nextAxiosClient.post("/nextAuth/login", {
        email,
        password,
      });
      login(response.data.loginUser);
      router.push("/");
    } catch (err: any) {
      setError(err.msg);
    } finally {
      setIsWaitingForLogin(false);
    }
  };

  return {
    isPasswordDisplayed,
    setIsPasswordDisplayed,
    email,
    setEmail,
    password,
    setPassword,
    submitPayload,
    isWaitingForLogin,
    error,
  };
}
