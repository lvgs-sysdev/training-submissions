// モーダルの開閉や、編集対象のデータを管理する状態管理フック
import { useState } from "react";
import { RestaurantData } from "@/shared/types/restaurant";

export const useRestaurantModalState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantData | null>(null);

  const handleOpenCreate = () => {
    setSelectedRestaurant(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (target: RestaurantData) => {
    setSelectedRestaurant(target);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedRestaurant(null), 200);
  };

  return {
    isOpen,
    selectedRestaurant,
    handleOpenCreate,
    handleOpenEdit,
    handleClose,
  };
};
