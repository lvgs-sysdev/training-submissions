"use client";

import { useLoading } from "@/context/LoadingContext";

export const Loading = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center pointer-events-auto overflow-hidden">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};
