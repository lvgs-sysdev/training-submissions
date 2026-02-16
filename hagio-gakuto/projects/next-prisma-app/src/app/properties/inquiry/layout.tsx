import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function InquiriesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = await cookies();
  const token = cookie.get("session_token")?.value;

  if (!token) {
    redirect("/login");
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY!);
  } catch (error) {
    console.error("JWT verification failed:", error);
    redirect("/login");
  }

  // 認証OKなら、子ページを表示
  return <>{children}</>;
}
