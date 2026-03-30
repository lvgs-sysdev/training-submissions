// フォームの入力管理と、保存（新規・更新）のAPI通信を行うフック
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { RestaurantData } from "@/shared/types/restaurant";

type Props = {
  restaurant: RestaurantData | null;
  onSuccess: () => void;
  onClose: () => void;
  stations: { id: number; name: string }[];
};

type FormData = {
  name: string;
  address: string;
  genre_id: string;
  station_id: string;
  link: string;
  opening_hours: string;
  average_rating: number;
};

export const useRestaurantEdit = ({
  restaurant,
  onSuccess,
  onClose,
  stations,
}: Props) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    genre_id: "",
    station_id: "",
    link: "",
    opening_hours: "",
    average_rating: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialStationName, setInitialStationName] = useState("");

  // 初期値のセット（編集時のみ動作）
  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || "",
        address: restaurant.address || "",
        genre_id: restaurant.genre_id ? restaurant.genre_id.toString() : "",
        station_id: restaurant.station_id
          ? restaurant.station_id.toString()
          : "",
        link: restaurant.link || "",
        opening_hours: restaurant.opening_hours || "",
        average_rating: restaurant.average_rating || 0,
      });

      // 駅名の特定
      if (restaurant.station_id && stations.length > 0) {
        const station = stations.find(
          (s) => String(s.id) === String(restaurant.station_id)
        );
        setInitialStationName(station ? station.name : "");
      }
    } else {
      // 新規作成時は駅名表示をリセット
      setInitialStationName("");
      // フォームデータのリセットが必要な場合はここで行う
      setFormData({
        name: "",
        address: "",
        genre_id: "",
        station_id: "",
        link: "",
        opening_hours: "",
        average_rating: 0,
      });
    }
  }, [restaurant, stations]);

  // 送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    const toastId = toast.loading("処理中...");

    try {
      // restaurantデータがあれば「更新」、なければ「新規作成」
      const isEditMode = !!restaurant;
      const url = isEditMode
        ? "/api/restaurants/update"
        : "/api/restaurants/create";
      const method = isEditMode ? "PUT" : "POST";

      const bodyData = isEditMode
        ? { id: restaurant?.id, ...formData } // 更新時はIDを含める
        : { ...formData }; // 新規時はデータのみ

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        toast.success(
          isEditMode ? "情報を更新しました！" : "お店を登録しました！",
          { id: toastId }
        );
        onSuccess();
        onClose();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "保存に失敗しました", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("エラーが発生しました", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    initialStationName,
    handleSubmit,
  };
};
