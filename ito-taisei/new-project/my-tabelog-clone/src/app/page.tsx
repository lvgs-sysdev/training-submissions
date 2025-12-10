import { redirect } from "next/navigation";

export default function HomeRedirect() {
  redirect("/top");
  return null;
}
