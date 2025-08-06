import { Metadata } from "next";
import EditProfileForm from "./components/EditProfileForm";

export const metadata: Metadata = {
  title: "プロフィール編集",
};
export default function ChangeProfilePage() {
  return <EditProfileForm />;
}
