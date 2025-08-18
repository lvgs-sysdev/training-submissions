import { Metadata } from "next";
import InquiryProperties from "./components/InquiryPropertyList";

export const metadata: Metadata = {
  title: "お問い合わせ物件",
};

export default function InquiriesPage() {
  return <InquiryProperties />;
}
