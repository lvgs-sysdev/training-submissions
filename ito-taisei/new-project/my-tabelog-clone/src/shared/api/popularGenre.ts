// 人気ジャンルのレストラン取得API
export async function getPopularGenreRestaurants() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/popular-genre-restaurants`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return await res.json();
}
