export async function getTopFeed() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/restaurants/feed`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { popular: [], newArrivals: [] };
  }

  return await res.json();
}
