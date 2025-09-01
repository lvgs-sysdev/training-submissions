import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  userId: number;
  name: string;
  role: number;
}
export default async function AdminLayout({
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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as CustomJwtPayload;
    if (decoded.role !== 2) {
      redirect("/");
    }
  } catch (error) {
    console.error("JWT verification failed:", error);
    redirect("/");
  }

  // 認証OKなら、子ページを表示
  return <>{children}</>;
}
