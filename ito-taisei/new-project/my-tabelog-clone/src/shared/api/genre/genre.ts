// ジャンル取得API
export async function getGenres() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/genre`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return await res.json();
}
