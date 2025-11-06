import { axiosClient } from "@/lib/api/api-client";
import { useState } from "react";

export default function useRefreshToken() {
  const [submissionMsg, setSubmissionMsg] = useState<string>("");
  const [error, setError] = useState<string>("");

  const refreshToken = async (email: string) => {
    try {
      const response = await axiosClient.post("/auth/refreshToken", { email });
      setSubmissionMsg(response.data.msg);
    } catch (err: any) {
      setError(err.msg);
    }
  };

  return { submissionMsg, setSubmissionMsg, error, setError, refreshToken };
}
