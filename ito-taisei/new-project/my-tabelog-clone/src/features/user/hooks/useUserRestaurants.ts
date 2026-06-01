// ユーザーのレストラン一覧データを取得するフック
import { useState, useEffect, useCallback } from "react";
import { Restaurant } from "@prisma/client";

type RestaurantWithRelations = Restaurant & {
  genre?: { name: string };
  station?: { name: string };
};

export const useUserRestaurants = (email?: string | null) => {
  const [restaurants, setRestaurants] = useState<RestaurantWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!email) {
      setIsLoading(false);
      return;
    }

    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/user/restaurants");
        if (res.ok) {
          const data = await res.json();
          setRestaurants(data);
        }
      } catch (error) {
        console.error("Failed to fetch user restaurants", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [email, refreshTrigger]);

  return { restaurants, isLoading, refresh };
};
