import { Metadata } from "next";
import FavoriteProperties from "./components/FavoritePropertyList";

export const metadata: Metadata = {
  title: "お気に入り物件",
};

export default function FavoritePage() {
  return (
    <div>
      <FavoriteProperties />
    </div>
  );
}
