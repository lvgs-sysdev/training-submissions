"use client";

import { useLoading } from "@/context/LoadingContext";
import { Property } from "@/types/PropertyType";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PropertyDetailInfo from "./PropertyDetailInfo";
import { Loading } from "@/components/layout/Loading";

export default function PropertyDetailFunction() {
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const { setIsLoading } = useLoading();

  const fetchProperty = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/property/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const result = await response.json();
      setProperty(result);
    } catch {
      setProperty(null);
    } finally {
      setIsLoading(false);
    }
  }, [id, setIsLoading]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  if (!property) {
    return <Loading />;
  }

  return <PropertyDetailInfo property={property} />;
}
