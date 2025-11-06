import { axiosClient } from "@/lib/api/api-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useRegisterForm() {
  const router = useRouter();

  const [isPasswordDisplayed, setIsPasswordDisplayed] =
    useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isWaitingForRegister, setIsWaitingForRegister] =
    useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const submitPayload = async () => {
    try {
      setIsWaitingForRegister(true);
      await axiosClient.post("/auth/register", { email, userName, password });
      const redirectUrl = `/verify?email=${encodeURIComponent(email)}`;
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.msg);
    } finally {
      setIsWaitingForRegister(false);
    }
  };

  return {
    isPasswordDisplayed,
    setIsPasswordDisplayed,
    email,
    setEmail,
    userName,
    setUserName,
    password,
    setPassword,
    submitPayload,
    isWaitingForRegister,
    error,
    setError,
  };
}
