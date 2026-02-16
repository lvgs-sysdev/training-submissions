import { Metadata } from "next";
import PropertySearchPage from "./components/PropertySearchPage";

export const metadata: Metadata = {
  title: "物件検索",
};

export default function Home() {
  return (
    <div className="">
      <PropertySearchPage />
    </div>
  );
}
