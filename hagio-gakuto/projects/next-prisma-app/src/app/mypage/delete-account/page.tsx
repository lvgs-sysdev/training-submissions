import { Metadata } from "next";
import DeleteAccountForm from "./components/DeleteAccountForm";

export const metadata: Metadata = {
  title: "アカウント削除",
};
export default function DeleteAccountPage() {
  return <DeleteAccountForm />;
}
