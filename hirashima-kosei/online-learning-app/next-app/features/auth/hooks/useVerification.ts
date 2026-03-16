import { useState } from "react";
import { axiosClient } from "@/lib/api/api-client";

export default function useVerification(verifiedToken: string) {
  const [successVerification, setSuccessVerification] =
    useState<boolean>(false);

  const verifyToken = async () => {
    try {
      const response = await axiosClient.post("/auth/verify", {
        verificationToken: verifiedToken,
      });
      response.status === 200
        ? setSuccessVerification(true)
        : setSuccessVerification(false);
    } catch (err) {
      setSuccessVerification(false);
    }
  };

  return { successVerification, verifyToken };
}
