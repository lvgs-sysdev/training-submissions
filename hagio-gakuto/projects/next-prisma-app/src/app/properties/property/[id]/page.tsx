import { Metadata } from "next";
import PropertyDetailFunction from "./components/PropertyDetail";

export const metadata: Metadata = {
  title: "物件詳細",
};

// propsからparamsを受け取る
export default async function PropertyDetailPage() {
  return <PropertyDetailFunction />;
}
