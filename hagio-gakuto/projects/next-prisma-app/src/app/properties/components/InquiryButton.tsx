"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import InquiryModal from "./InquiryModal"; // モーダルコンポーネントをインポート
import { UnitDetail, UnitSummary } from "@/types/PropertyType";
import { useAuth } from "@/context/AuthContext";

interface Props {
  properties: UnitSummary[] | UnitDetail;
  onSuccess: () => void;
  children: React.ReactNode;
}

export default function InquiryButton({
  properties,
  onSuccess,
  children,
}: Readonly<Props>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleOpenModal = () => {
    // ログイン状態をチェック
    if (!user) {
      router.push("/login"); // 未ログインならログインページへ
      return;
    }
    // 認証済みであればモーダルを開く
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    onSuccess();
    handleCloseModal();
  };

  return (
    <>
      {user && (
        <>
          <button
            onClick={handleOpenModal}
            className="fixed bottom-8 right-8 w-auto px-4 h-16 bg-sky-600 text-white rounded-full shadow-lg flex gap-2 items-center justify-center hover:bg-sky-700 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 cursor-pointer"
          >
            {children}
          </button>
          <InquiryModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            properties={properties}
            onSuccess={handleSuccess}
          />
        </>
      )}
    </>
  );
}
