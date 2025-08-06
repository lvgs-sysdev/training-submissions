import { Metadata } from "next";
import { ChangePasswordForm } from "./components/ChangePasswordForm";

export const metadata: Metadata = {
  title: "パスワード変更",
};
export function ChangePassword() {
  return <ChangePasswordForm />;
}
export default ChangePassword;
