"use client";

import { useLoading } from "@/context/LoadingContext";
import { useCallback, useEffect, useState } from "react";

export function useAddress() {
  const [zipcode, setZipcode] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [error, setError] = useState("");
  const { setIsLoading } = useLoading();

  const fetchAddress = useCallback(async () => {
    if (zipcode.length !== 7 || !/^\d{7}$/.test(zipcode)) {
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`
      );
      if (!response.ok) {
        throw new Error("ネットワークエラーが発生しました。");
      }
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setPrefecture(data.results[0].address1);
        setCity(data.results[0].address2);
        setStreet(data.results[0].address3);
      } else {
        setError("有効な郵便番号ではありません。");
        setPrefecture("");
        setCity("");
        setStreet("");
      }
    } catch (err) {
      setError("住所の取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }, [zipcode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAddress();
    }, 300); // ユーザーの入力を待つために少し遅延させる

    return () => clearTimeout(timer);
  }, [zipcode, fetchAddress]);

  const handleZipcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setZipcode(value);
  };

  return {
    zipcode,
    handleZipcodeChange,
    prefecture,
    city,
    street,
    setPrefecture,
    setStreet,
    setCity,
    error,
  };
}
