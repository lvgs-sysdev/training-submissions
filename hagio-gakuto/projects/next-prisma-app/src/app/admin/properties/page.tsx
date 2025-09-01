import { Metadata } from "next";
import AdminPropertiesTable from "./components/AdminPropertiesTable";

export const metadata: Metadata = {
  title: "物件管理",
};

export default function AdminPropertiesPage() {
  return <AdminPropertiesTable />;
}
