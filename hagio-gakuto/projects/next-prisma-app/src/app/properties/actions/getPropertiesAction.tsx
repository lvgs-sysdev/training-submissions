"use server";

export interface SearchFilters {
  sortBy: string; // 並び順を追加
  withinNeighborhood: boolean; // ご近所手当を追加
  priceMin: string;
  priceMax: string;
  layouts: string[];
  area: string;
  walk: string;
  age: string;
  floor: boolean;
}

export interface SearchFormState {
  message: string;
  filters: SearchFilters;
}

export async function searchAction(
  prevState: SearchFormState,
  formData: FormData
): Promise<SearchFormState> {
  const filters: SearchFilters = {
    sortBy: (formData.get("sortBy") as string) || "price_asc", // デフォルト値
    withinNeighborhood: !!formData.get("withinNeighborhood"),
    priceMin: formData.get("price-min") as string,
    priceMax: formData.get("price-max") as string,
    layouts: formData.getAll("layout") as string[],
    area: formData.get("area") as string,
    walk: formData.get("walk") as string,
    age: formData.get("age") as string,
    floor: !!formData.get("floor"),
  };

  console.log("検索条件:", filters);

  // ... データベース検索などの処理 ...

  return {
    message: "検索条件を更新しました。",
    filters,
  };
}