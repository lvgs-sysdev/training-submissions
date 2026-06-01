"use client";

import React from "react";
import StationAutocomplete from "@/shared/components/form/StationAutocomplete";
import { RestaurantData } from "@/shared/types/restaurant";
import { useMasterData } from "@/features/user/hooks/useMasterData";
import { useRestaurantEdit } from "@/features/user/hooks/useRestaurantEdit";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  restaurant: RestaurantData | null;
};

export default function RestaurantFormModal({ isOpen, onClose, onSuccess, restaurant }: Props) {
  const { genres, stations } = useMasterData();

  const { 
    formData, 
    setFormData, 
    isSubmitting, 
    initialStationName, 
    handleSubmit 
  } = useRestaurantEdit({ restaurant, onSuccess, onClose, stations });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">情報の編集</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <input 
            type="text" 
            placeholder="店名" 
            required 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            className="border p-2 rounded w-full" 
          />

          <input 
            type="text" 
            placeholder="エリア・住所" 
            required 
            value={formData.address} 
            onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
            className="border p-2 rounded w-full" 
          />

          <select
            value={formData.genre_id}
            onChange={(e) => setFormData({ ...formData, genre_id: e.target.value })}
            className="border p-2 rounded w-full bg-white"
            required
          >
            <option value="">ジャンルを選択</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id.toString()}>
                {genre.name}
              </option>
            ))}
          </select>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">最寄駅（任意）</label>
            <StationAutocomplete
              key={initialStationName}
              stations={stations.map((s) => ({ id: s.id.toString(), name: s.name }))}
              onSelect={(item) => {
                setFormData({ ...formData, station_id: item.id });
              }}
              initialValue={initialStationName}
              inputStyle={{ width: "100%", padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #e5e7eb" }}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">評価:</span>
            <input 
              type="number" 
              min="0" max="5" step="0.1" 
              value={formData.average_rating} 
              onChange={(e) => setFormData({ ...formData, average_rating: Number(e.target.value) })} 
              className="border p-2 rounded w-20" 
            />
            <span className="text-xs text-gray-400">（0〜5.0）</span>
          </div>

          <input 
            type="url" 
            placeholder="食べログURLなど" 
            value={formData.link} 
            onChange={(e) => setFormData({ ...formData, link: e.target.value })} 
            className="border p-2 rounded w-full" 
          />

          <textarea 
            placeholder="メモ・営業時間など" 
            value={formData.opening_hours} 
            onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })} 
            className="border p-2 rounded w-full h-20" 
          />

          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300">
              キャンセル
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-[#d9534f] rounded hover:bg-[#c9302c] disabled:opacity-50">
              保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
