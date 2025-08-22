import { Metadata } from "next";
import MyInfoCard from "./components/MyInfoCard";

export const metadata: Metadata = {
  title: "マイページ",
};
export default function MyPage() {
  return <MyInfoCard />;
}
