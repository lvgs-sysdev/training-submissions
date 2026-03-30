// 駅取得API
export async function getStations() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/station`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return await res.json();
}
