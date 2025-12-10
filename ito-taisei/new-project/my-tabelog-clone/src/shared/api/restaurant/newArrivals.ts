// 新着レストラン取得API
export async function getNewArrivals() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/restaurants/new-arrivals`, { cache: "no-store" });
  if (!res.ok) return [];
  return await res.json();
}
