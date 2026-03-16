"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { useUserRestaurants } from "@/features/user/hooks/useUserRestaurants";
import { useRestaurantDelete } from "@/features/user/hooks/useRestaurantDelete";
import { useRestaurantFilter } from "@/features/user/hooks/useRestaurantFilter";
import { useRestaurantModalState } from "@/features/user/hooks/useRestaurantModalState";
import { MyPageHeader } from "@/features/user/components/MyPageHeader";
import { MyRestaurantCard } from "@/features/user/components/MyRestaurantCard";
import RestaurantFormModal from "@/features/user/components/RestaurantFormModal";

export default function MyPage() {
  const { data: session, status } = useSession();
  const { restaurants, isLoading, refresh } = useUserRestaurants(session?.user?.email);

  const { 
    keyword, setKeyword, selectedGenre, setSelectedGenre, 
    availableGenres, filteredRestaurants 
  } = useRestaurantFilter(restaurants);

  const { handleDelete } = useRestaurantDelete(refresh);

  const { 
    isOpen, selectedRestaurant, 
    handleOpenCreate, handleOpenEdit, handleClose 
  } = useRestaurantModalState();

  if (status === "loading") {
    return (
      <div className="pt-32 text-center text-gray-500 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // 未ログイン表示
  if (!session) {
    return <div className="pt-32 text-center text-gray-500">ログイン後に利用可能です。</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="bottom-center" />

      {/* ヘッダー */}
      <MyPageHeader
        restaurantCount={filteredRestaurants.length}
        keyword={keyword}
        setKeyword={setKeyword}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        availableGenres={availableGenres}
        onOpenModal={handleOpenCreate}
      />

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto px-4 pt-36 pb-20">
        {filteredRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            {restaurants.length === 0 ? (
              <>
                <p className="mb-2">まだ登録がありません</p>
                <p className="text-sm">右上の ＋ ボタンからお気に入りを追加しましょう！</p>
              </>
            ) : (
              <p>条件に一致するお店が見つかりませんでした</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((r) => (
              <MyRestaurantCard 
                key={r.id} 
                restaurant={r} 
                onDelete={handleDelete}
                onEdit={handleOpenEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* モーダル */}
      <RestaurantFormModal
        isOpen={isOpen}
        onClose={handleClose}
        restaurant={selectedRestaurant}
        onSuccess={() => {
          if (refresh) refresh();
          handleClose();
        }}
      />
    </div>
  );
}
