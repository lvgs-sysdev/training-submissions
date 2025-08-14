"use client";

import { useLoading } from "@/context/LoadingContext";
import { Property } from "@/types/PropertyType";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PropertyDetailInfo from "./PropertyDetailInfo";
import { Loading } from "@/components/layout/Loading";

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string; // idを取得（型をstringにキャスト）

  // ★ 3. useStateの初期値をnullに変更
  const [property, setProperty] = useState<Property | null>(null);
  const { setIsLoading } = useLoading();

  const fetchProperty = useCallback(async () => {
    if (!id) return; // idがなければ何もしない
    setIsLoading(true);
    try {
      const response = await fetch(`/api/property/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const result = await response.json();
      setProperty(result[0]);
    } catch {
      setProperty(null);
    } finally {
      setIsLoading(false);
    }
  }, [id, setIsLoading]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  // ★ 4. データ取得前はローディング表示
  if (!property) {
    return <Loading />;
  }

  // ★ 5. mapUrlはデータ取得後に定義

  return <PropertyDetailInfo property={property} />;
}
